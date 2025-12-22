import Link from "next/link";
import React from "react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="border-b border-primary/20 pb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/70 mb-4 inline-block transition-colors">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Terms of Service</h1>
                    <p className="mt-2 text-foreground/60">Last updated: December 13, 2025</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Daily Hanzi mobile application and website (&quot;Service&quot;), you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">2. Subscriptions</h2>
                    <p>
                        Some parts of the Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in advance on a recurring and periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">3. Learning Progress</h2>
                    <p>
                        Our Service tracks your learning progress, including characters learned and quiz scores (&quot;Learning Data&quot;). This data is stored to provide you with a personalized learning experience. You acknowledge that this data is essential for the functionality of the Service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">4. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">5. Limit of Liability</h2>
                    <p>
                        In no event shall Daily Hanzi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">6. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">7. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:{" "}
                        <a href="mailto:support@dailyhanzi.com" className="text-primary hover:text-primary/70 transition-colors">
                            support@dailyhanzi.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
