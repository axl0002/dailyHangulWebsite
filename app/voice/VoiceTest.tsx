"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Speed = { id: string; rate: number };
type Voice = { id: string; label: string; gender: string; family: string };
type Item = { id: string; type: "word" | "sentence" | string; text: string; romanization: string; english: string };
/** A section is one independent decision: which voice (from `voices`) and which speed should read `items`. */
type Section = { id: string; title: string; voices: string[]; items: string[] };
export type Manifest = {
    app: string;
    language: string;
    languageCode: string;
    base: string;
    speeds: Speed[];
    voices: Voice[];
    items: Item[];
    /** Optional. Without it the page falls back to two sections (words / sentences) that share every voice. */
    sections?: Section[];
    generated: string;
    version?: number;
};

type Ratings = Record<string, number>; // voice label -> 1..5
type SectionState = { ratings: Ratings; favourite: string | null; speed: string | null };
type State = { sections: Record<string, SectionState>; notes: string; name: string };

const SPEED_LABEL: Record<string, string> = { slow: "Slow", normal: "Normal", fast: "Fast" };
const STORAGE_PREFIX = "voice-test:";
const STORAGE_SHAPE = "v2"; // per-section picks — older single-decision saves are ignored
const EMPTY_SECTION: SectionState = { ratings: {}, favourite: null, speed: null };

function load(key: string): State | null {
    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        return raw ? (JSON.parse(raw) as State) : null;
    } catch {
        return null;
    }
}
function save(key: string, state: State) {
    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state));
    } catch {
        /* private mode etc. — picks just won't persist */
    }
}

/** The noun a section is about, for copy ("this word" / "this sentence"). */
function noun(section: Section, plural = false) {
    const base = section.id === "words" ? "word" : section.id === "sentences" ? "sentence" : "line";
    return plural ? `${base}s` : base;
}

export default function VoiceTest({ manifest }: { manifest: Manifest }) {
    const { language, base, speeds, voices, items } = manifest;
    const sections = useMemo<Section[]>(
        () =>
            manifest.sections ?? [
                { id: "words", title: "Words", voices: voices.map((v) => v.id), items: items.filter((i) => i.type === "word").map((i) => i.id) },
                { id: "sentences", title: "Sentences", voices: voices.map((v) => v.id), items: items.filter((i) => i.type !== "word").map((i) => i.id) },
            ],
        [manifest.sections, voices, items],
    );
    const voiceById = useMemo(() => new Map(voices.map((v) => [v.id, v])), [voices]);
    const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
    const defaultSpeed = speeds.find((s) => s.id === "normal")?.id ?? speeds[0].id;

    // Playback speed is per section (words and sentences are judged at different paces).
    const [playSpeed, setPlaySpeed] = useState<Record<string, string>>({});
    const [state, setState] = useState<State>({ sections: {}, notes: "", name: "" });
    const [submit, setSubmit] = useState<{ status: "idle" | "saving" | "done" | "error"; message?: string }>({ status: "idle" });
    const [reveal, setReveal] = useState(false);
    const [playing, setPlaying] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const storageKey = `${manifest.app}:${STORAGE_SHAPE}`;
    useEffect(() => {
        const saved = load(storageKey);
        if (saved) setState({ sections: saved.sections ?? {}, notes: saved.notes ?? "", name: saved.name ?? "" });
    }, [storageKey]);

    const update = useCallback(
        (patch: Partial<State>) => {
            setState((prev) => {
                const next = { ...prev, ...patch };
                save(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );
    const updateSection = useCallback(
        (sectionId: string, patch: Partial<SectionState>) => {
            setState((prev) => {
                const current = prev.sections[sectionId] ?? EMPTY_SECTION;
                const next = { ...prev, sections: { ...prev.sections, [sectionId]: { ...current, ...patch } } };
                save(storageKey, next);
                return next;
            });
        },
        [storageKey],
    );

    const clipUrl = (voice: Voice, item: Item, sp: string) => `${base}/${voice.id}/${sp}/${item.id}.mp3?v=${manifest.version ?? 1}`;

    const play = (voice: Voice, item: Item, sp: string) => {
        const key = `${voice.id}/${sp}/${item.id}`;
        const el = audioRef.current;
        if (!el) return;
        if (playing === key) {
            el.pause();
            setPlaying(null);
            return;
        }
        el.src = clipUrl(voice, item, sp);
        el.play().catch(() => setPlaying(null));
        setPlaying(key);
    };

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const done = () => setPlaying(null);
        el.addEventListener("ended", done);
        el.addEventListener("error", done);
        return () => {
            el.removeEventListener("ended", done);
            el.removeEventListener("error", done);
        };
    }, []);

    const sectionState = (id: string) => state.sections[id] ?? EMPTY_SECTION;
    const decided = sections.filter((s) => {
        const st = sectionState(s.id);
        return !!st.favourite || Object.keys(st.ratings).length > 0;
    });
    const canSubmit = state.name.trim().length > 0 && decided.length > 0;

    const submitResults = async () => {
        if (!canSubmit || submit.status === "saving") return;
        setSubmit({ status: "saving" });
        // Human-readable summary in the legacy columns; the structured per-section picks go in `sections`.
        const summary = (pick: (s: SectionState) => string | null) =>
            sections
                .map((s) => `${s.id}: ${pick(sectionState(s.id)) ?? "—"}`)
                .join(" · ");
        const { error } = await supabase.from("voice_test_responses").insert({
            name: state.name.trim(),
            favourite: summary((s) => s.favourite),
            speed: summary((s) => s.speed),
            ratings: Object.fromEntries(sections.map((s) => [s.id, sectionState(s.id).ratings])),
            sections: Object.fromEntries(sections.map((s) => [s.id, sectionState(s.id)])),
            notes: state.notes.trim() || null,
            voices: Object.fromEntries(voices.map((v) => [v.label, v.id])),
            manifest_generated: manifest.generated,
            user_agent: typeof navigator === "undefined" ? null : navigator.userAgent.slice(0, 300),
        });
        if (error) {
            setSubmit({ status: "error", message: error.message });
            return;
        }
        setSubmit({ status: "done" });
    };

    const appName =
        language === "Vietnamese" ? "Viet" : language === "French" ? "Francais" : language === "German" ? "Deutsch" : language === "Korean" ? "Hangul" : language;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans bg-background text-foreground">
            <audio ref={audioRef} preload="none" />
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="border-b border-primary/20 pb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/70 mb-4 inline-block transition-colors">
                        ← Daily {appName}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Help us choose the {language} voices for the app</h1>
                    <p className="mt-3 text-foreground/70 max-w-2xl leading-relaxed">
                        The app reads single words and full sentences aloud, and the best voice for one is not always the best for the
                        other. Below are two separate decisions: pick the voice and speed you&#39;d want for <strong>words</strong>, then the
                        voice and speed you&#39;d want for <strong>sentences</strong>. Add your name at the end and submit.
                    </p>
                </header>

                {sections.map((section, idx) => {
                    const sectionVoices = section.voices.map((id) => voiceById.get(id)).filter((v): v is Voice => !!v);
                    const sectionItems = section.items.map((id) => itemById.get(id)).filter((i): i is Item => !!i);
                    const sp = playSpeed[section.id] ?? defaultSpeed;
                    const st = sectionState(section.id);
                    return (
                        <section key={section.id} className="space-y-6">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-primary">
                                    {idx + 1}. {section.title}
                                </h2>
                                <p className="text-sm text-foreground/60">
                                    {sectionVoices.length} candidate voices reading the same {sectionItems.length} {noun(section, true)}. Tap a letter to hear
                                    that voice; tap again to stop.
                                </p>
                            </div>

                            {/* Playback speed for this section */}
                            <div className="space-y-2">
                                <div className="text-sm font-medium">Listen at</div>
                                <div className="inline-flex rounded-xl border border-primary/20 bg-accent/60 p-1" role="radiogroup" aria-label={`${section.title} playback speed`}>
                                    {speeds.map((s) => (
                                        <button
                                            key={s.id}
                                            role="radio"
                                            aria-checked={sp === s.id}
                                            onClick={() => setPlaySpeed((prev) => ({ ...prev, [section.id]: s.id }))}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                sp === s.id ? "bg-primary text-white shadow-sm" : "text-foreground/70 hover:text-primary"
                                            }`}
                                        >
                                            {SPEED_LABEL[s.id] ?? s.id}
                                            <span className="ml-1.5 text-xs opacity-70 tabular-nums">×{s.rate}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ClipTable items={sectionItems} voices={sectionVoices} speed={sp} playing={playing} onPlay={(v, i) => play(v, i, sp)} reveal={reveal} />

                            {/* Ratings + favourite for this section */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-primary">Rate the voices for {noun(section, true)}</h3>
                                    <p className="text-sm text-foreground/60">
                                        1 = sounds robotic or foreign, 5 = could be a native speaker. Then choose the one you&#39;d pick for{" "}
                                        {noun(section, true)}.
                                    </p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {sectionVoices.map((v) => (
                                        <div
                                            key={v.label}
                                            className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                                                st.favourite === v.label ? "border-primary bg-accent" : "border-primary/15 bg-accent/40"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <div className="font-semibold">Voice {v.label}</div>
                                                    <div className="text-xs text-foreground/50">
                                                        {v.gender === "F" ? "Female" : "Male"}
                                                        {reveal ? ` · ${v.id}` : ""}
                                                    </div>
                                                </div>
                                                <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none">
                                                    <input
                                                        type="radio"
                                                        name={`favourite-${section.id}`}
                                                        className="accent-primary"
                                                        checked={st.favourite === v.label}
                                                        onChange={() => updateSection(section.id, { favourite: v.label })}
                                                    />
                                                    Best for {noun(section, true)}
                                                </label>
                                            </div>
                                            <Stars value={st.ratings[v.label] ?? 0} onChange={(n) => updateSection(section.id, { ratings: { ...st.ratings, [v.label]: n } })} />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="text-sm font-medium">Which speed felt right for {noun(section, true)}?</div>
                                    <div className="flex flex-wrap gap-2">
                                        {speeds.map((s) => (
                                            <label
                                                key={s.id}
                                                className="inline-flex items-center gap-2 text-sm cursor-pointer rounded-lg border border-primary/15 px-3 py-1.5 bg-accent/40 select-none"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`speed-pref-${section.id}`}
                                                    className="accent-primary"
                                                    checked={st.speed === s.id}
                                                    onChange={() => updateSection(section.id, { speed: s.id })}
                                                />
                                                {SPEED_LABEL[s.id] ?? s.id}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}

                {/* Notes + submit */}
                <section className="space-y-4 border-t border-primary/10 pt-8">
                    <h2 className="text-2xl font-bold text-primary">{sections.length + 1}. Send us your picks</h2>
                    <label className="block space-y-1">
                        <span className="text-sm font-medium">Anything that sounded off? (optional)</span>
                        <textarea
                            value={state.notes}
                            onChange={(e) => update({ notes: e.target.value })}
                            rows={3}
                            placeholder="e.g. Voice G mispronounces 생각, Voice B is too slow on single words…"
                            className="w-full rounded-xl border border-primary/20 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </label>
                    <label className="block space-y-1 max-w-sm">
                        <span className="text-sm font-medium">Your name</span>
                        <input
                            type="text"
                            value={state.name}
                            onChange={(e) => update({ name: e.target.value.slice(0, 80) })}
                            placeholder="So we know who to thank"
                            autoComplete="name"
                            className="w-full rounded-xl border border-primary/20 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </label>
                    <div className="text-sm text-foreground/60">
                        {sections.map((s) => {
                            const st = sectionState(s.id);
                            return (
                                <div key={s.id}>
                                    <span className="font-medium text-foreground/80">{s.title}:</span>{" "}
                                    {st.favourite ? `Voice ${st.favourite}` : "no voice picked"}
                                    {st.speed ? ` · ${SPEED_LABEL[st.speed] ?? st.speed}` : " · no speed picked"}
                                </div>
                            );
                        })}
                    </div>
                    {submit.status === "done" ? (
                        <div className="rounded-xl border border-primary/20 bg-accent p-4 text-sm">
                            <div className="font-semibold text-primary">Thank you, {state.name.trim()} — your answers are saved.</div>
                            <div className="text-foreground/60 mt-1">You can change anything above and send again if you have second thoughts.</div>
                        </div>
                    ) : null}
                    {submit.status === "error" ? (
                        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                            Couldn&#39;t save your answers ({submit.message}). Please check your connection and try again.
                        </div>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={submitResults}
                            disabled={!canSubmit || submit.status === "saving"}
                            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            {submit.status === "saving" ? "Saving…" : submit.status === "done" ? "Send again" : "Submit my answers"}
                        </button>
                        <button onClick={() => setReveal((r) => !r)} className="ml-auto text-xs text-foreground/50 hover:text-primary underline-offset-2 hover:underline">
                            {reveal ? "Hide technical names" : "Show technical names"}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

function ClipTable({
    items,
    voices,
    speed,
    playing,
    onPlay,
    reveal,
}: {
    items: Item[];
    voices: Voice[];
    speed: string;
    playing: string | null;
    onPlay: (v: Voice, i: Item) => void;
    reveal: boolean;
}) {
    if (!items.length) return null;
    return (
        <div className="rounded-2xl border border-primary/15 bg-accent/30 overflow-hidden">
            <ul className="divide-y divide-primary/10">
                {items.map((item) => (
                    <li key={item.id} className="px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 sm:pr-6">
                            <div className={`font-medium leading-snug ${item.type === "word" ? "text-xl" : "text-base"}`}>{item.text}</div>
                            {item.romanization ? <div className="text-sm text-foreground/60">{item.romanization}</div> : null}
                            <div className="text-sm text-foreground/50">{item.english}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0 sm:max-w-[60%] sm:justify-end" role="group" aria-label={`Play ${item.text}`}>
                            {voices.map((v) => {
                                const key = `${v.id}/${speed}/${item.id}`;
                                const active = playing === key;
                                return (
                                    <button
                                        key={v.id}
                                        onClick={() => onPlay(v, item)}
                                        title={reveal ? v.id : `Voice ${v.label}`}
                                        aria-pressed={active}
                                        className={`h-10 w-10 rounded-full text-sm font-semibold border transition-all ${
                                            active
                                                ? "bg-primary text-white border-primary scale-105 shadow-md"
                                                : "bg-white/70 text-primary border-primary/25 hover:border-primary hover:bg-accent"
                                        }`}
                                    >
                                        {active ? "■" : v.label}
                                    </button>
                                );
                            })}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    role="radio"
                    aria-checked={value === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => onChange(n)}
                    className={`text-2xl leading-none transition-transform hover:scale-110 ${n <= value ? "text-primary" : "text-primary/25"}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}
