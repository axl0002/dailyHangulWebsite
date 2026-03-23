"use client";

import { useState, useEffect, useRef } from 'react';
import { DateLabel } from './useDateLabels';

type DateLabelModalProps = {
    date: string;
    existingLabels: DateLabel[];
    position: { x: number; y: number };
    onAdd: (date: string, label: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onClose: () => void;
};

function formatDateLabel(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

export default function DateLabelModal({ date, existingLabels, position, onAdd, onDelete, onClose }: DateLabelModalProps) {
    const [label, setLabel] = useState('');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = label.trim();
        if (trimmed) {
            setSaving(true);
            await onAdd(date, trimmed);
            setLabel('');
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        await onDelete(id);
    };

    return (
        <div
            ref={modalRef}
            className="fixed z-50 bg-white border border-gray-200 shadow-xl rounded-xl p-4 w-80"
            style={{ left: position.x, top: position.y }}
        >
            <p className="text-sm font-semibold text-gray-900 mb-3">{formatDateLabel(date)}</p>
            {existingLabels.length > 0 && (
                <div className="mb-3 space-y-1.5">
                    {existingLabels.map((dl) => (
                        <div key={dl.id} className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                            <span className="text-xs font-medium text-amber-800 truncate">{dl.label}</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(dl.id)}
                                className="text-amber-400 hover:text-red-500 flex-shrink-0 transition-colors"
                                title="Remove label"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g. Android launch"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={100}
                    disabled={saving}
                />
                <button
                    type="submit"
                    disabled={saving || !label.trim()}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 rounded-lg transition-colors"
                >
                    Add
                </button>
            </form>
        </div>
    );
}
