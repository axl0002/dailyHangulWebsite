"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/lib/supabase';

type ChartData = {
    date: string;
    pro: number;
    free: number;
    total: number;
};

export default function UserGrowthChart({ filter }: { filter?: 'all' | 'true' | 'false' }) {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState({ fetched: 0, displayed: 0, totalInPeriod: 0 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch ALL non-beta profiles with pagination
            let allProfiles: { created_at: string; is_pro: boolean | null }[] = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;

            while (hasMore) {
                const from = page * pageSize;
                const to = from + pageSize - 1;

                let query = supabase
                    .from('profiles')
                    .select('created_at, is_pro')
                    .eq('is_beta', false)
                    .range(from, to);

                if (filter === 'true') {
                    query = query.eq('is_pro', true);
                } else if (filter === 'false') {
                    query = query.eq('is_pro', false);
                }

                const { data: batch, error } = await query;

                if (error) {
                    console.error('Error fetching profiles:', error);
                    setLoading(false);
                    return;
                }

                if (batch && batch.length > 0) {
                    allProfiles = [...allProfiles, ...batch];
                    if (batch.length < pageSize) {
                        hasMore = false;
                    }
                } else {
                    hasMore = false;
                }

                page++;

                // Safety break to prevent infinite loops if DB is huge (e.g. stop at 50k)
                if (allProfiles.length > 50000) {
                    console.warn('Reached safety limit of 50k profiles');
                    hasMore = false;
                }
            }

            const profiles = allProfiles;

            // Calculate date 14 days ago (start of day)
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today

            const startDate = new Date();
            startDate.setDate(today.getDate() - 14);
            startDate.setHours(0, 0, 0, 0); // Start of 14 days ago

            // Process data
            const dailyStats: Record<string, { pro: number; free: number }> = {};

            // Initialize buckets for the last 14 days
            for (let i = 0; i < 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateString = d.toISOString().split('T')[0];
                dailyStats[dateString] = { pro: 0, free: 0 };
            }

            let inPeriodCount = 0;

            profiles?.forEach((profile) => {
                if (!profile.created_at) return;

                const profileDate = new Date(profile.created_at);
                const dateString = profileDate.toISOString().split('T')[0];

                // Check if profile is within the logical 14 day window
                // We use the string key match which effectively groups by UTC day
                if (dailyStats[dateString]) {
                    if (profile.is_pro) {
                        dailyStats[dateString].pro++;
                    } else {
                        dailyStats[dateString].free++;
                    }
                    inPeriodCount++;
                }
            });

            // Convert to array and sort by date
            const chartData = Object.entries(dailyStats)
                .map(([date, stats]) => ({
                    date,
                    pro: stats.pro,
                    free: stats.free,
                    total: stats.pro + stats.free
                }))
                .sort((a, b) => a.date.localeCompare(b.date));

            setData(chartData);
            setDebugInfo({
                fetched: profiles?.length || 0,
                displayed: chartData.length,
                totalInPeriod: inPeriodCount
            });
            setLoading(false);
        };

        fetchData();
    }, [filter]);

    if (loading) return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-[400px]">
            <span className="text-gray-400">Loading chart data...</span>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 col-span-1 md:col-span-2">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">User Growth (Last 14 Days)</h3>
                <span className="text-xs text-gray-400">
                    {debugInfo.totalInPeriod} new users in period ({debugInfo.fetched} total scanned)
                </span>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => {
                                const [, month, day] = value.split('-');
                                return `${parseInt(month)}/${parseInt(day)}`;
                            }}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#F9FAFB' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    // Custom label formatting for UserGrowthChart
                                    let formattedLabel = label;
                                    if (typeof label === 'string') {
                                        const dateParts = label.split('-');
                                        if (dateParts.length === 3) {
                                            formattedLabel = `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
                                        }
                                    }

                                    return (
                                        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl min-w-[150px]">
                                            <p className="font-semibold text-gray-900 mb-2">{formattedLabel}</p>
                                            {payload.map((entry: { name: string; value: number; color: string; payload: { total: number } }, index: number) => {
                                                const isPro = entry.name === 'Pro Users';
                                                // Pro uses Indigo-600, Free uses Gray-700 for better contrast
                                                const colorClass = isPro ? 'text-indigo-600' : 'text-gray-700';
                                                const value = entry.value;
                                                const total = entry.payload.total;
                                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

                                                return (
                                                    <div key={index} className="flex items-center justify-between gap-4 mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: entry.color }}
                                                            />
                                                            <span className={`text-sm font-medium ${colorClass}`}>
                                                                {entry.name}
                                                            </span>
                                                        </div>
                                                        <span className={`text-sm font-bold ${colorClass}`}>
                                                            {value} ({percentage}%)
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="pro" name="Pro Users" stackId="users" fill="#6366F1" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="free" name="Free Users" stackId="users" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
