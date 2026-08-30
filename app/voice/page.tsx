import type { Metadata } from "next";
import VoiceTest from "./VoiceTest";
import manifest from "./manifest.json";

export const metadata: Metadata = {
    title: `${manifest.language} voice test`,
    description: `Help us pick the most natural ${manifest.language} voice for the app.`,
    robots: { index: false, follow: false },
};

export default function VoiceTestPage() {
    return <VoiceTest manifest={manifest} />;
}
