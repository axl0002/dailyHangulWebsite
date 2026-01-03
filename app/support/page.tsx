import Link from "next/link";
import React from "react";

export default function SupportPage() {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="border-b border-primary/20 pb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/70 mb-4 inline-block transition-colors">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">App Support</h1>
                    <p className="mt-2 text-foreground/60">We&#39;re here to help you</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">Contact Us</h2>
                    <p>
                        If you are experiencing issues with the Daily Hanzi app, have questions about your subscription, or want to provide feedback, please don&#39;t hesitate to reach out.
                    </p>
                    <p>
                        Our support team is available via email and will get back to you as soon as possible, usually within 24-48 hours.
                    </p>
                    <div className="pt-4">
                        <a
                            href="mailto:support@dailyhanzi.app"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-all shadow-sm"
                        >
                            Email Support
                        </a>
                        <p className="mt-2 text-sm text-foreground/60">
                            or write to us at <a href="mailto:support@dailyhanzi.app" className="text-primary hover:underline">support@dailyhanzi.app</a>
                        </p>
                    </div>
                </section>

                <section className="space-y-4 pt-8 border-t border-primary/10">
                    <h2 className="text-xl font-semibold text-primary">Common Topics</h2>
                    <ul className="list-disc list-outside pl-5 space-y-2 marker:text-primary">
                        <li>Widget not updating (Try opening the app to refresh)</li>
                        <li>Restoring purchases</li>
                        <li>Account deletion requests</li>
                        <li>Feature requests and suggestions</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
