"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProfilesCache, filterProfiles, type ProFilter, type DateRange } from './useProfilesCache';

type ChartRow = { name: string; pro: number };

// profiles.sentence_formalities: multi-select of formal / standard / informal.
// A user can enable more than one, so a single profile can contribute to more
// than one bar. The picker is Pro-gated — Free users are locked to the
// ["standard"] default — so we chart Pro users only, like the other
// post-paywall settings. Percentages use the Pro pool as denominator, not the
// sum of bars, since bars overlap.
const BUCKETS = ['formal', 'standard', 'informal'] as const;
const LABELS: Record<typeof BUCKETS[number], string> = {
    formal: 'Formal',
    standard: 'Standard',
    informal: 'Informal',
};

export default function FormalityChart({ filter, dateRange = 'all' }: { filter?: ProFilter; dateRange?: DateRange }) {
    const { profiles, loading } = useProfilesCache();

    const { data, proTotal } = useMemo(() => {
        const rows = filterProfiles(profiles, 'true', dateRange); // force Pro
        const counts: Record<string, number> = { formal: 0, standard: 0, informal: 0 };
        for (const r of rows) {
            const picks = r.sentence_formalities;
            if (!Array.isArray(picks)) continue;
            for (const p of picks) if (counts[p] !== undefined) counts[p] += 1;
        }
        return {
            data: BUCKETS.map(key => ({ name: LABELS[key], pro: counts[key] })) as ChartRow[],
            proTotal: rows.length,
        };
    }, [profiles, dateRange]);

    if (loading) return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-[300px]">
            <span className="text-gray-400">Loading chart data...</span>
        </div>
    );

    if (filter === 'false') return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1 flex flex-col items-center justify-center h-[300px]">
            <p className="text-gray-500 font-medium">Formality</p>
            <p className="text-xs text-gray-400 mt-1">Pro feature — no data to show for Free users.</p>
        </div>
    );

    if (data.every(d => d.pro === 0)) return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[300px]">
            <p className="text-gray-500 font-medium">No Formality data available</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Formality</h3>
                <p className="text-xs text-gray-500 mt-1">Pro-only multi-select — Free users are locked to Standard. Users can pick more than one, so bars overlap.</p>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: '#F9FAFB' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const value = payload[0].value as number;
                                    const percentage = proTotal > 0 ? ((value / proTotal) * 100).toFixed(1) : '0.0';
                                    return (
                                        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl min-w-[150px]">
                                            <p className="font-semibold text-gray-900 mb-2">{label}</p>
                                            <div className="flex items-center justify-between gap-4 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6366F1' }} />
                                                    <span className="text-sm font-medium text-indigo-600">Pro Users</span>
                                                </div>
                                                <span className="text-sm font-bold text-indigo-600">{value} ({percentage}%)</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="pro" name="Pro Users" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
