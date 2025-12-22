import { AppleStoreButton, GooglePlayButton } from "@/components/StoreButtons";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/40 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/40 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-3xl opacity-30" />
      </div>

      <main className="max-w-4xl w-full flex flex-col items-center text-center space-y-10 z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-medium text-foreground tracking-wide">
            The #1 Lock Screen Learning App
          </span>
        </div>

        {/* Headlines */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-primary drop-shadow-sm">
            Master Chinese <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-secondary">
              One Unlock
            </span>{" "}
            at a Time
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-foreground/80 leading-relaxed">
            Learn Chinese characters effortlessly. The app that teaches you Hanzi every time you wake up your phone.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4">
          <AppleStoreButton />
          <GooglePlayButton />
        </div>

        {/* Feature Highlights (Micro) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 w-full text-foreground/70 text-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-accent border border-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            </div>
            <span>Lock Screen Learning</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-accent border border-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <span>Spaced Repetition</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-accent border border-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <span>Daily Progress</span>
          </div>
        </div>
      </main>


      <footer className="w-full max-w-4xl mx-auto pt-16 pb-8 text-center sm:text-left z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-foreground/60 gap-4">
          <p>&copy; {new Date().getFullYear()} Daily Hanzi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div >
  );
}
