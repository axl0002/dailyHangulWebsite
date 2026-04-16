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
                    <p className="mt-2 text-foreground/60">Last updated: January 2, 2026</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">1. Introduction</h2>
                    <p>
                        Daily Hangul (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit the website or use our mobile application (collectively, &quot;Services&quot;) and our practices for collecting, using, maintaining, protecting, and disclosing that information.
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
                            <strong className="text-primary">Third-Party Authentication:</strong> If you sign in using Google or Apple, we collect your email address and basic profile information provided by these services to create and manage your account.
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
                        <li>To update Home Screen and Lock Screen widgets with your daily characters and progress.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">4. Data Security</h2>
                    <p>
                        We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">5. Device Permissions & Widgets</h2>
                    <p>
                        Our mobile application may request specific permissions to function correctly, such as background fetch capabilities to update widgets. These updates ensure your Home Screen and Lock Screen widgets display the correct daily tokens and learning status. We do not access other private data on your device without explicit permission.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">6. Data Deletion</h2>
                    <p>
                        You have the right to request the deletion of your account and all associated personal data. To exercise this right, please contact our support team at <a href="mailto:support@dailyhangul.app" className="text-primary hover:text-primary/70 transition-colors">support@dailyhangul.app</a>. We will process your request in accordance with applicable laws.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary">7. Contact Information</h2>
                    <p>
                        To ask questions or comment about this privacy policy and our privacy practices, contact us at:{" "}
                        <a href="mailto:support@dailyhangul.app" className="text-primary hover:text-primary/70 transition-colors">
                            support@dailyhangul.app
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}
