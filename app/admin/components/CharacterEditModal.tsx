"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type ExampleSentence = {
    korean: string;
    english: string;
};

export type Character = {
    id: string;
    character: string;
    meaning: string;
    example_sentences: ExampleSentence[];
    freq_rank: number;
    topik_level: number;
    category: string;
    visible: boolean;
};

interface CharacterEditModalProps {
    character: Character;
    onClose: () => void;
    onSave: () => void;
}

export default function CharacterEditModal({ character, onClose, onSave }: CharacterEditModalProps) {
    const [editingCharacter, setEditingCharacter] = useState<Character>(character);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("name")
                    .order("name");

                if (error) throw error;
                if (data) {
                    setCategories(data.map((c) => c.name));
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleSentenceChange = (index: number, field: keyof ExampleSentence, value: string) => {
        const updatedSentences = [...editingCharacter.example_sentences];
        updatedSentences[index] = { ...updatedSentences[index], [field]: value };
        setEditingCharacter({ ...editingCharacter, example_sentences: updatedSentences });
    };

    const handleAddSentence = () => {
        const newSentence: ExampleSentence = { korean: "", english: "" };
        setEditingCharacter({
            ...editingCharacter,
            example_sentences: [...editingCharacter.example_sentences, newSentence],
        });
    };

    const handleRemoveSentence = (index: number) => {
        const updatedSentences = editingCharacter.example_sentences.filter((_, i) => i !== index);
        setEditingCharacter({ ...editingCharacter, example_sentences: updatedSentences });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from("characters")
                .update({
                    meaning: editingCharacter.meaning,
                    character: editingCharacter.character,
                    example_sentences: editingCharacter.example_sentences,
                    freq_rank: editingCharacter.freq_rank,
                    topik_level: editingCharacter.topik_level,
                    category: editingCharacter.category,
                    visible: editingCharacter.visible,
                })
                .eq("id", editingCharacter.id);

            if (error) throw error;
            onSave();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            alert("Error updating word: " + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Word</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Word</label>
                            <input
                                type="text"
                                value={editingCharacter.character}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, character: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Meaning</label>
                            <textarea
                                value={editingCharacter.meaning}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, meaning: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">TOPIK</label>
                                <input
                                    type="number"
                                    value={editingCharacter.topik_level}
                                    onChange={(e) => setEditingCharacter({ ...editingCharacter, topik_level: parseInt(e.target.value) })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Freq Rank</label>
                                <input
                                    type="number"
                                    value={editingCharacter.freq_rank}
                                    onChange={(e) => setEditingCharacter({ ...editingCharacter, freq_rank: parseInt(e.target.value) })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={editingCharacter.category}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, category: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                            >
                                <option value="">Select...</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="visible"
                                type="checkbox"
                                checked={editingCharacter.visible}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, visible: e.target.checked })}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="visible" className="ml-2 block text-sm font-medium text-gray-700">
                                Visible to public
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-900">Example Sentences</h3>
                            <button
                                type="button"
                                onClick={handleAddSentence}
                                className="text-sm bg-white border px-3 py-1 rounded hover:bg-gray-100 shadow-sm flex items-center"
                            >
                                <span className="mr-1 text-green-600 font-bold">+</span> Add Sentence
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {editingCharacter.example_sentences.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">
                                    No example sentences yet. Click &quot;Add Sentence&quot; to create one.
                                </div>
                            ) : (
                                editingCharacter.example_sentences.map((sentence, index) => (
                                    <div key={index} className="bg-white p-3 rounded border shadow-sm relative group">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSentence(index)}
                                            className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                            title="Delete Sentence"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Korean</label>
                                                <input
                                                    type="text"
                                                    value={sentence.korean}
                                                    onChange={(e) => handleSentenceChange(index, "korean", e.target.value)}
                                                    className="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-sm border focus:ring-black focus:border-black"
                                                    placeholder="한국어..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">English</label>
                                                <input
                                                    type="text"
                                                    value={sentence.english}
                                                    onChange={(e) => handleSentenceChange(index, "english", e.target.value)}
                                                    className="block w-full border-gray-300 rounded-md shadow-sm p-1.5 text-sm border focus:ring-black focus:border-black"
                                                    placeholder="Meaning..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-white text-gray-700 border rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium shadow-md disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
