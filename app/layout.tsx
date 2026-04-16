import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Hangul - Learn Korean Characters (Hangul) on Your Lock Screen",
  description: "Master Korean characters (Hangul) effortlessly with Daily Hangul. The #1 lock screen learning app using spaced repetition for daily fluency.",
  keywords: ["Learn Korean", "Korean Characters", "Hangul", "Lock Screen Learning", "Language App", "Spaced Repetition", "Daily Korean", "TOPIK", "Vocabulary"],
  openGraph: {
    title: "Daily Hangul - Learn Korean Characters on Your Lock Screen",
    description: "Master Korean characters (Hangul) effortlessly with every unlock. The #1 lock screen learning app.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Hangul - Lock Screen Learning",
    description: "Learn Korean characters (Hangul) effortlessly on your lock screen.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
