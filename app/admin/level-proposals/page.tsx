"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Focused review surface for the level-6 re-cut (level_proposals): reviewers
// work level-by-level confirming/adjusting final_level before the cutover
// applies it onto characters.topik_level. The Words tab shows the same data
// inline; this page is the "verify L1 tonight" workflow.

type ProposalRow = {
    character_id: number;
    character: string;
    freq_rank: number | null;
    seed_level: number;
    ai_level: number | null;
    ai_note: string | null;
    final_level: number;
    updated_by: string | null;
    characters: { romanization: string | null; meaning: string | null; category: string | null } | null;
};

const LEVELS = [1, 2, 3, 4, 5, 6];

export default function LevelProposalsPage() {
    const [rows, setRows] = useState<ProposalRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [levelFilter, setLevelFilter] = useState<number | null>(1);
    const [aiOnly, setAiOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [summary, setSummary] = useState<{ perLevel: Record<number, number>; edited: number; aiFlagged: number } | null>(null);
    const [reviewerEmail, setReviewerEmail] = useState<string | null>(null);
    const itemsPerPage = 100;

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setReviewerEmail(data.user?.email ?? null));
    }, []);

    const fetchSummary = useCallback(async () => {
        const perLevel: Record<number, number> = {};
        for (const l of LEVELS) {
            const { count } = await supabase
                .from("level_proposals")
                .select("character_id", { count: "exact", head: true })
                .eq("final_level", l);
            perLevel[l] = count ?? 0;
        }
        const { count: edited } = await supabase
            .from("level_proposals")
            .select("character_id", { count: "exact", head: true })
            .not("updated_by", "is", null);
        const { count: aiFlagged } = await supabase
            .from("level_proposals")
            .select("character_id", { count: "exact", head: true })
            .not("ai_level", "is", null);
        setSummary({ perLevel, edited: edited ?? 0, aiFlagged: aiFlagged ?? 0 });
    }, []);

    const fetchRows = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from("level_proposals")
                .select("*, characters(romanization, meaning, category)", { count: "exact" });
            if (levelFilter !== null) query = query.eq("final_level", levelFilter);
            if (aiOnly) query = query.not("ai_level", "is", null);
            if (searchTerm) query = query.ilike("character", `%${searchTerm}%`);
            query = query
                .order("freq_rank", { ascending: true, nullsFirst: false })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
            const { data, count, error } = await query;
            if (error) throw error;
            setRows((data as ProposalRow[]) || []);
            setTotalCount(count ?? 0);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [levelFilter, aiOnly, searchTerm, currentPage]);

    useEffect(() => { fetchRows(); }, [fetchRows]);
    useEffect(() => { fetchSummary(); }, [fetchSummary]);

    const setFinalLevel = async (row: ProposalRow, newLevel: number) => {
        if (row.final_level === newLevel) return;
        const prev = row.final_level;
        setRows(rs => rs.map(r => r.character_id === row.character_id ? { ...r, final_level: newLevel, updated_by: reviewerEmail } : r));
        const { error } = await supabase
            .from("level_proposals")
            .update({ final_level: newLevel, updated_by: reviewerEmail, updated_at: new Date().toISOString() })
            .eq("character_id", row.character_id);
        if (error) {
            setRows(rs => rs.map(r => r.character_id === row.character_id ? { ...r, final_level: prev } : r));
            alert("Couldn't save: " + error.message);
        } else {
            setSummary(s => s && {
                ...s,
                perLevel: { ...s.perLevel, [prev]: s.perLevel[prev] - 1, [newLevel]: (s.perLevel[newLevel] ?? 0) + 1 },
                edited: s.edited, // recount only on reload; close enough live
            });
        }
    };

    const acceptAi = (row: ProposalRow) => {
        if (row.ai_level != null) setFinalLevel(row, row.ai_level);
    };

    const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Level Review</h1>
            <p className="text-sm text-gray-500 mb-6 max-w-2xl">
                Proposed 6-level re-cut. Confirm or adjust each word&#39;s level — your changes save instantly
                and will be applied to the app at cutover. Level 1 should be the ~200 words a complete
                beginner meets first; level 6 the long tail.
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {/* Summary */}
            {summary && (
                <div className="flex flex-wrap gap-2 mb-6 text-sm">
                    {LEVELS.map(l => (
                        <span key={l} className="px-3 py-1.5 rounded-lg bg-white border shadow-sm">
                            L{l}: <b>{summary.perLevel[l] ?? 0}</b>
                        </span>
                    ))}
                    <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 shadow-sm">AI-flagged: <b>{summary.aiFlagged}</b></span>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 shadow-sm">Human-edited: <b>{summary.edited}</b></span>
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
                <div className="inline-flex rounded-lg border bg-white p-1">
                    <button
                        onClick={() => { setLevelFilter(null); setCurrentPage(1); }}
                        className={`px-3 py-1.5 rounded text-sm ${levelFilter === null ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    >
                        All
                    </button>
                    {LEVELS.map(l => (
                        <button
                            key={l}
                            onClick={() => { setLevelFilter(l); setCurrentPage(1); }}
                            className={`px-3 py-1.5 rounded text-sm ${levelFilter === l ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            L{l}
                        </button>
                    ))}
                </div>
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={aiOnly} onChange={(e) => { setAiOnly(e.target.checked); setCurrentPage(1); }} />
                    AI-flagged only
                </label>
                <input
                    type="text"
                    placeholder="Search word…"
                    className="border p-2 rounded text-sm"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Word", "Romanization", "Meaning", "Freq", "Seed", "AI suggestion", "Final level", "Reviewed by"].map(h => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={8} className="px-4 py-6 text-center">Loading…</td></tr>
                        ) : rows.map(row => (
                            <tr key={row.character_id} className={row.ai_level != null && row.ai_level !== row.final_level ? "bg-amber-50/50" : undefined}>
                                <td className="px-4 py-3 whitespace-nowrap text-lg font-bold">{row.character}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm italic text-gray-600">{row.characters?.romanization}</td>
                                <td className="px-4 py-3 text-sm text-gray-500 max-w-[260px]">{row.characters?.meaning}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 tabular-nums">{row.freq_rank}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.seed_level}</td>
                                <td className="px-4 py-3 text-sm max-w-[260px]">
                                    {row.ai_level == null ? (
                                        <span className="text-gray-300">agrees</span>
                                    ) : row.ai_level === row.final_level ? (
                                        <span className="text-green-700 text-xs">accepted ({row.ai_note})</span>
                                    ) : (
                                        <div className="text-amber-700 text-xs">
                                            <b>L{row.ai_level}</b> — {row.ai_note}
                                            <button onClick={() => acceptAi(row)} className="ml-2 underline text-amber-800 hover:text-amber-900">accept</button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <select
                                        value={row.final_level}
                                        onChange={(e) => setFinalLevel(row, parseInt(e.target.value, 10))}
                                        className="border rounded px-2 py-1 text-sm bg-white"
                                    >
                                        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400">{row.updated_by ?? ""}</td>
                            </tr>
                        ))}
                        {!loading && rows.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">Nothing matches.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg shadow-sm">
                <span className="text-sm text-gray-700">
                    Page <b>{currentPage}</b> of <b>{totalPages}</b>
                    <span className="ml-2 text-gray-500">({totalCount} words)</span>
                </span>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50">Previous</button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
}
