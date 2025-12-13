import { AppleStoreButton, GooglePlayButton } from "@/components/StoreButtons";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/40 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/40 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-900/30 rounded-full blur-3xl opacity-30" />
      </div>

      <main className="max-w-4xl w-full flex flex-col items-center text-center space-y-10 z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-sm font-medium text-sky-100/90 tracking-wide">
            The #1 AI Relationship Upgrade
          </span>
        </div>

        {/* Headlines */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
            Elevate Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Relationships
            </span>{" "}
            with AI
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300/90 leading-relaxed">
            Your personal relationship coach, available 24/7. Understand faster, communicate better, and deepen your connection with intelligent insights.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
          <AppleStoreButton />
          <GooglePlayButton />
        </div>

        {/* Feature Highlights (Micro) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full text-slate-400/80 text-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-white/5 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
            </div>
            <span>Instant Analysis</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-white/5 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
            </div>
            <span>Growth Tracking</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-white/5 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <span>Better Connection</span>
          </div>
        </div>
      </main>


      <footer className="w-full max-w-4xl mx-auto pt-16 pb-8 text-center sm:text-left z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Relationship AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div >
  );
}
