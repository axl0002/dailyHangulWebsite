"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProfilesCache, type ProFilter } from './useProfilesCache';
import { ChartLoading, ChartError, ChartEmpty, ChartProOnlyPlaceholder } from './ChartMessage';

type ChartRow = { name: string; pro: number };

// profiles.sentence_formalities: multi-select of formal / standard / informal.
// A user can enable more than one, so a single profile can contribute to more
// than one bar. The picker is Pro-gated — Free users are locked to the
// ["standard"] default — so we chart Pro users only, like the other
// post-paywall settings. Percentages use the Pro pool as denominator, not the
// sum of bars, since bars overlap.
//
// Server has already unnested sentence_formalities per user, so each row is
// {key: 'formal'|'standard'|'informal', n}. We reduce into fixed buckets so
// the axis is stable even if a bucket has zero picks.
const BUCKETS = ['formal', 'standard', 'informal'] as const;
const LABELS: Record<typeof BUCKETS[number], string> = {
    formal: 'Formal',
    standard: 'Standard',
    informal: 'Informal',
};

export default function FormalityChart({ filter = 'all' }: { filter?: ProFilter; dateRange?: unknown }) {
    const { distributions, loading, error, retry } = useProfilesCache();

    const data: ChartRow[] = useMemo(() => {
        const counts: Record<string, number> = { formal: 0, standard: 0, informal: 0 };
        for (const r of distributions?.formality ?? []) {
            if (r.key && counts[r.key] !== undefined) counts[r.key] += r.n;
        }
        return BUCKETS.map(key => ({ name: LABELS[key], pro: counts[key] }));
    }, [distributions]);

    // Bars overlap (a user can pick more than one), so % uses the Pro pool
    // as denominator, not the sum of bars.
    const proTotal = distributions?.pool.pro ?? 0;

    if (loading) return <ChartLoading />;
    if (error) return <ChartError title="Formality" error={error} onRetry={retry} />;
    if (filter === 'false') return <ChartProOnlyPlaceholder title="Formality" />;
    if (data.every(d => d.pro === 0)) return <ChartEmpty title="No Formality data available" />;

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
