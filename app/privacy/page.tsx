import Link from "next/link";
import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="border-b border-primary/20 pb-8">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary/70 mb-4 inline-block transition-colors">
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">Privacy Policy</h1>
                    <p className="mt-2 text-foreground/60">Last updated: December 13, 2025</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">1. Introduction</h2>
                    <p>
                        Daily Hanzi (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website or use our mobile application (collectively, &quot;Services&quot;) and our practices for collecting, using, maintaining, protecting, and disclosing that information.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">2. Information We Collect</h2>
                    <p>We collect several types of information from and about users of our Services, including:</p>
                    <ul className="list-disc list-outside pl-5 space-y-2 marker:text-primary">
                        <li>
                            <strong className="text-primary">Personal Information:</strong> Name, email address, and other identifiers you provide when creating an account.
                        </li>
                        <li>
                            <strong className="text-primary">Usage Data:</strong> Information about your internet connection, the equipment you use to access our Services, and usage details.
                        </li>
                        <li>
                            <strong className="text-primary">Learning Data:</strong> Information about your learning progress, including characters studied, quiz results, and streak data. This data is used to personalize your learning experience and track your progress.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">3. How We Use Your Information</h2>
                    <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
                    <ul className="list-disc list-outside pl-5 space-y-2 marker:text-primary">
                        <li>To present our Services and key contents to you.</li>
                        <li>To provide you with information, products, or services that you request from us.</li>
                        <li>To fulfill any other purpose for which you provide it.</li>
                        <li>To provide you with notices about your account.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">4. Data Security</h2>
                    <p>
                        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">5. Contact Information</h2>
                    <p>
                        To ask questions or comment about this privacy policy and our privacy practices, contact us at:{" "}
                        <a href="mailto:support@dailyhanzi.com" className="text-primary hover:text-primary/70 transition-colors">
                            support@dailyhanzi.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
