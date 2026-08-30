"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Speed = { id: string; rate: number };
type Voice = { id: string; label: string; gender: string; family: string };
type Item = { id: string; type: "word" | "sentence" | string; text: string; romanization: string; english: string };
export type Manifest = {
    app: string;
    language: string;
    languageCode: string;
    base: string;
    speeds: Speed[];
    voices: Voice[];
    items: Item[];
    generated: string;
    version?: number;
};

type Ratings = Record<string, number>; // voice label -> 1..5
type State = { ratings: Ratings; favourite: string | null; speed: string | null; notes: string; name: string };

const SPEED_LABEL: Record<string, string> = { slow: "Slow", normal: "Normal", fast: "Fast" };
const STORAGE_PREFIX = "voice-test:";

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
        /* private mode etc. — ratings just won't persist */
    }
}

export default function VoiceTest({ manifest }: { manifest: Manifest }) {
    const { language, base, speeds, voices, items } = manifest;
    const defaultSpeed = speeds.find((s) => s.id === "normal")?.id ?? speeds[0].id;
    const [speed, setSpeed] = useState(defaultSpeed);
    const [state, setState] = useState<State>({ ratings: {}, favourite: null, speed: null, notes: "", name: "" });
    const [submit, setSubmit] = useState<{ status: "idle" | "saving" | "done" | "error"; message?: string }>({ status: "idle" });
    const [reveal, setReveal] = useState(false);
    const [playing, setPlaying] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const saved = load(manifest.app);
        if (saved) setState({ ...saved, name: saved.name ?? "" });
    }, [manifest.app]);

    const update = useCallback(
        (patch: Partial<State>) => {
            setState((prev) => {
                const next = { ...prev, ...patch };
                save(manifest.app, next);
                return next;
            });
        },
        [manifest.app],
    );

    const clipUrl = (voice: Voice, item: Item, sp = speed) => `${base}/${voice.id}/${sp}/${item.id}.mp3?v=${manifest.version ?? 1}`;

    const play = (voice: Voice, item: Item) => {
        const key = `${voice.id}/${speed}/${item.id}`;
        const el = audioRef.current;
        if (!el) return;
        if (playing === key) {
            el.pause();
            setPlaying(null);
            return;
        }
        el.src = clipUrl(voice, item);
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

    const words = useMemo(() => items.filter((i) => i.type === "word"), [items]);
    const sentences = useMemo(() => items.filter((i) => i.type !== "word"), [items]);

    const ratedCount = Object.keys(state.ratings).length;
    const canSubmit = state.name.trim().length > 0 && (ratedCount > 0 || !!state.favourite);

    const submitResults = async () => {
        if (!canSubmit || submit.status === "saving") return;
        setSubmit({ status: "saving" });
        const { error } = await supabase.from("voice_test_responses").insert({
            name: state.name.trim(),
            favourite: state.favourite,
            speed: state.speed,
            ratings: state.ratings,
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

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans bg-background text-foreground">
            <audio ref={audioRef} preload="none" />
            <div className="max-w-4xl mx-auto space-y-10">
                <header className="border-b border-primary/20 pb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/70 mb-4 inline-block transition-colors">
                        ← Daily {language === "Vietnamese" ? "Viet" : language === "French" ? "Francais" : language === "German" ? "Deutsch" : language === "Korean" ? "Hangul" : language}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Which {language} voice sounds most natural?</h1>
                    <p className="mt-3 text-foreground/70 max-w-2xl leading-relaxed">
                        We&#39;re choosing the voice that reads words and sentences aloud in the app. Below are {voices.length} candidate
                        voices reading the same {words.length} words and {sentences.length} sentences. Rate each voice, pick the one
                        you&#39;d most want to learn from, add your name and submit.
                    </p>
                </header>

                {/* Speed picker */}
                <section className="space-y-3">
                    <h2 className="text-lg font-semibold text-primary">1. Speed</h2>
                    <p className="text-sm text-foreground/60">
                        The app offers three speeds. Switch between them while you listen — every clip below follows this setting.
                    </p>
                    <div className="inline-flex rounded-xl border border-primary/20 bg-accent/60 p-1" role="radiogroup" aria-label="Playback speed">
                        {speeds.map((s) => (
                            <button
                                key={s.id}
                                role="radio"
                                aria-checked={speed === s.id}
                                onClick={() => setSpeed(s.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    speed === s.id ? "bg-primary text-white shadow-sm" : "text-foreground/70 hover:text-primary"
                                }`}
                            >
                                {SPEED_LABEL[s.id] ?? s.id}
                                <span className="ml-1.5 text-xs opacity-70 tabular-nums">×{s.rate}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Clip grids */}
                <section className="space-y-3">
                    <h2 className="text-lg font-semibold text-primary">2. Listen</h2>
                    <p className="text-sm text-foreground/60">Tap a letter to hear that voice read the line. Tap again to stop.</p>
                    <ClipTable title="Words" items={words} voices={voices} speed={speed} playing={playing} onPlay={play} reveal={reveal} />
                    <ClipTable title="Sentences" items={sentences} voices={voices} speed={speed} playing={playing} onPlay={play} reveal={reveal} />
                </section>

                {/* Ratings */}
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-primary">3. Rate the voices</h2>
                    <p className="text-sm text-foreground/60">
                        1 = sounds robotic or foreign, 5 = could be a native speaker. Then choose the one you&#39;d pick for the app.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {voices.map((v) => (
                            <div
                                key={v.label}
                                className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                                    state.favourite === v.label ? "border-primary bg-accent" : "border-primary/15 bg-accent/40"
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
                                            name="favourite"
                                            className="accent-primary"
                                            checked={state.favourite === v.label}
                                            onChange={() => update({ favourite: v.label })}
                                        />
                                        Most authentic
                                    </label>
                                </div>
                                <Stars value={state.ratings[v.label] ?? 0} onChange={(n) => update({ ratings: { ...state.ratings, [v.label]: n } })} />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="text-sm font-medium">Which speed felt right for a learner?</div>
                        <div className="flex flex-wrap gap-2">
                            {speeds.map((s) => (
                                <label key={s.id} className="inline-flex items-center gap-2 text-sm cursor-pointer rounded-lg border border-primary/15 px-3 py-1.5 bg-accent/40 select-none">
                                    <input
                                        type="radio"
                                        name="speed-pref"
                                        className="accent-primary"
                                        checked={state.speed === s.id}
                                        onChange={() => update({ speed: s.id })}
                                    />
                                    {SPEED_LABEL[s.id] ?? s.id}
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="block space-y-1 pt-2">
                        <span className="text-sm font-medium">Anything that sounded off? (optional)</span>
                        <textarea
                            value={state.notes}
                            onChange={(e) => update({ notes: e.target.value })}
                            rows={3}
                            placeholder="e.g. Voice C mispronounces the second sentence, Voice A sounds too flat…"
                            className="w-full rounded-xl border border-primary/20 bg-white/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                    </label>
                </section>

                {/* Submit */}
                <section className="space-y-4 border-t border-primary/10 pt-8">
                    <h2 className="text-lg font-semibold text-primary">4. Send us your picks</h2>
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
    title,
    items,
    voices,
    speed,
    playing,
    onPlay,
    reveal,
}: {
    title: string;
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
            <div className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary/80 border-b border-primary/10">{title}</div>
            <ul className="divide-y divide-primary/10">
                {items.map((item) => (
                    <li key={item.id} className="px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 sm:pr-6">
                            <div className={`font-medium leading-snug ${item.type === "word" ? "text-xl" : "text-base"}`}>{item.text}</div>
                            {item.romanization ? <div className="text-sm text-foreground/60">{item.romanization}</div> : null}
                            <div className="text-sm text-foreground/50">{item.english}</div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0" role="group" aria-label={`Play ${item.text}`}>
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
