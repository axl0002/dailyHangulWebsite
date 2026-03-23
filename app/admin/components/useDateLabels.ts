"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type DateLabel = {
    id: string;
    date: string;
    label: string;
};

export function useDateLabels() {
    const [labels, setLabels] = useState<Record<string, DateLabel[]>>({});

    const fetchLabels = useCallback(async () => {
        const { data, error } = await supabase
            .from('date_labels')
            .select('id, date, label');

        if (error) {
            console.error('Error fetching date labels:', error);
            return;
        }

        const map: Record<string, DateLabel[]> = {};
        data?.forEach((row) => {
            if (!map[row.date]) map[row.date] = [];
            map[row.date].push(row);
        });
        setLabels(map);
    }, []);

    useEffect(() => {
        fetchLabels();
    }, [fetchLabels]);

    const addLabel = useCallback(async (date: string, label: string) => {
        const { error } = await supabase
            .from('date_labels')
            .insert({ date, label });
        if (error) {
            console.error('Error inserting label:', error);
            return;
        }
        await fetchLabels();
    }, [fetchLabels]);

    const deleteLabel = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('date_labels')
            .delete()
            .eq('id', id);
        if (error) {
            console.error('Error deleting label:', error);
            return;
        }
        await fetchLabels();
    }, [fetchLabels]);

    return { labels, addLabel, deleteLabel };
}
