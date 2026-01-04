'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email }]);

            if (error) throw error;

            setStatus('success');
            setMessage('You have been added to the waitlist!');
            setEmail('');
        } catch (error) {
            console.error('Error submitting to waitlist:', error);
            setStatus('error');
            setMessage((error as Error).message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={loading || status === 'success'}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                    type="submit"
                    disabled={loading || status === 'success'}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Joining...' : status === 'success' ? 'Joined!' : 'Join Waitlist'}
                </button>
            </form>
            <p className="text-xs text-foreground/50 mt-2 text-center">
                By joining, you agree to receive updates from us.
            </p>
            {message && (
                <p className={`mt-3 text-sm ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
