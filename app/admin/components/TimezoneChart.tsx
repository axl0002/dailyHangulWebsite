"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

type ChartData = {
    name: string;
    value: number;
};

export default function TimezoneChart({ filter }: { filter?: 'all' | 'true' | 'false' }) {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch profiles with timezone
            let query = supabase
                .from('profiles')
                .select('timezone');

            if (filter === 'true') {
                query = query.eq('is_pro', true);
            } else if (filter === 'false') {
                query = query.eq('is_pro', false);
            }

            const { data: profiles, error } = await query;

            if (error) {
                console.error('Error fetching profiles:', error);
                setLoading(false);
                return;
            }

            // Process data
            const timezoneCounts: Record<string, number> = {};

            profiles?.forEach((profile: { timezone: string | null }) => {
                const tz = profile.timezone;
                if (tz) {
                    // Start extracting the region (e.g., "America" from "America/New_York")
                    // or maybe just keep the whole thing if the user wants specific locations.
                    // The prompt said "geographic location using the timezone column".
                    // Full timezone strings can be many diverse strings. 
                    // Let's try to group by the primary region (before the first slash)
                    // or just show the top timezones.

                    // Let's stick to the raw timezone string first as it's more accurate, 
                    // maybe truncated if too long?
                    // Actually, grouping by Region (e.g. Asia, Europe, America) might be better for a summary,
                    // but specific timezones give more detail. 
                    // Let's use the full string but sort by count.
                    const key = tz.trim();
                    timezoneCounts[key] = (timezoneCounts[key] || 0) + 1;
                }
            });

            // Convert to array and sort by count descending
            const chartData = Object.entries(timezoneCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 15); // Limit to top 15 to avoid clutter

            setData(chartData);
            setLoading(false);
        };

        fetchData();
    }, [filter]);

    if (loading) return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-[300px]">
            <span className="text-gray-400">Loading chart data...</span>
        </div>
    );

    if (data.length === 0) return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[300px]">
            <p className="text-gray-500 font-medium">No Timezone data available</p>
            <p className="text-sm text-gray-400 mt-1">User locations will appear here.</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-gray-900">User Locations (Timezone)</h3>
            <div className="h-[500px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            width={220}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#F9FAFB' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'][index % 4] || '#6366F1'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
