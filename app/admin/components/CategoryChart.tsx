"use client";

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '@/lib/supabase';

type ChartData = {
    name: string;
    value: number;
};

export default function CategoryChart({ filter }: { filter?: 'all' | 'true' | 'false' }) {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch profiles with selected_categories
            let query = supabase
                .from('profiles')
                .select('selected_categories')
                .eq('is_beta', false);

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
            const categoryCounts: Record<string, number> = {};

            profiles?.forEach((profile: { selected_categories: string[] | string | null }) => {
                const categories = profile.selected_categories;

                if (categories) {
                    let catArray: string[] = [];

                    if (Array.isArray(categories)) {
                        catArray = categories;
                    } else if (typeof categories === 'string') {
                        // Handle comma-separated string just in case
                        catArray = categories.split(',').map(s => s.trim());
                    }

                    catArray.forEach(cat => {
                        if (cat) {
                            const key = cat.trim();
                            if (key) {
                                categoryCounts[key] = (categoryCounts[key] || 0) + 1;
                            }
                        }
                    });
                }
            });

            // Convert to array and sort by count descending
            const chartData = Object.entries(categoryCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

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
            <p className="text-gray-500 font-medium">No Category data available</p>
            <p className="text-sm text-gray-400 mt-1">User interests will appear here.</p>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Selected Categories</h3>
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
                            width={140}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#F9FAFB' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#EC4899', '#F472B6', '#FBCFE8', '#FCE7F3'][index % 4] || '#EC4899'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
