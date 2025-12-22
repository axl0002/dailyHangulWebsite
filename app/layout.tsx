import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Hanzi - Learn Chinese Characters (Hanzi) on Lock Screen",
  description: "The best app to learn Chinese characters (Hanzi) effortlessly. Master vocabulary with daily spaced repetition right on your phone's lock screen.",
  keywords: ["Learn Chinese", "Chinese Characters", "Hanzi", "Lock Screen Learning", "Language App", "Spaced Repetition", "Daily Chinese"],
  openGraph: {
    title: "Daily Hanzi - Learn Chinese on Lock Screen",
    description: "Master Learning Chinese characters effortlessly with every unlock.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Hanzi",
    description: "Learn Chinese characters on your lock screen.",
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
