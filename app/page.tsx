import Image from "next/image";
import Script from "next/script";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-background selection:bg-primary/20">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "Daily Hangul",
            "operatingSystem": "iOS, Android",
            "applicationCategory": "EducationalApplication",
            "description": "Master Korean characters (Hangul) effortlessly on your lock screen with daily spaced repetition.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-20">
        <div className="relative w-80 h-24">
          <Image
            src="/logo-long.png"
            alt="Daily Hangul Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        {/* Placeholder for future links or auth buttons */}
        <div className="hidden sm:flex gap-6 text-sm font-medium text-foreground/60">
          {/* <a href="#" className="hover:text-primary transition-colors">How it works</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a> */}
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 flex flex-col sm:justify-center z-10 pb-20 pt-10 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column: Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8 max-w-xl mx-auto lg:mx-0">

            {/* Social Proof Pill (Mocked based on reference) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-primary/20 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 border-2 border-accent" />
                <div className="w-6 h-6 rounded-full bg-primary/30 border-2 border-accent" />
                <div className="w-6 h-6 rounded-full bg-primary/40 border-2 border-accent" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-foreground/80 pl-1">
                <span>#1 Korean lock screen learning app</span>
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Master Korean Daily<br />
                <span className="text-primary text-3xl sm:text-5xl block mt-2">
                  from Your Lock Screen
                </span>
              </h1>
              <p className="text-lg sm:text-lg text-foreground/60 leading-relaxed max-w-md">
                Build a new daily habit of learning Korean the easiest way possible. Seamlessly integrated directly into your lock screen.
              </p>
            </div>

            {/* Store Buttons */}
            {/* <div className="w-full pt-2 flex justify-center gap-3 flex-wrap">
              <a
                href="https://apps.apple.com/us/app/daily-hangul/id6756919959"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 text-white bg-black rounded-xl hover:bg-black/80 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg viewBox="0 0 384 512" fill="currentColor" className="w-8 h-8">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 98 123.2 25.3-1.8 44.7-16 83.2-15.6 38.6 .4 52.3 15.2 89.8 13.8 44.5-1.2 75.9-67.4 85-88.1-37.6-11.2-61.9-53-61.5-98.7H318.7zm-40.1-209.7c7.8-12.1 27.2-39.2 26-80.1-34.5 3.8-67.6 34.4-85 58-7.5 10.1-17.8 28-15.3 58.6 39.4 1.4 69.4-19.1 74.3-36.5z" />
                </svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-medium opacity-80 mb-0.5">Download on the</span>
                  <span className="text-xl font-bold tracking-wide">App Store</span>
                </div>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.alexliu.dailyhangul"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 text-white bg-black rounded-xl hover:bg-black/80 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg viewBox="0 0 512 512" className="w-7 h-7">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#00D2FF" />
                  <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#00F076" />
                  <path d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z" fill="#FFDA00" />
                  <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#FF3A44" />
                </svg>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-medium opacity-80 mb-0.5">Get it on</span>
                  <span className="text-xl font-bold tracking-wide">Google Play</span>
                </div>
              </a>
            </div> */}

            {/* Waitlist Form */}
            <div className="w-full pt-2 flex flex-col items-center">
              <iframe
                src="https://subscribe-forms.beehiiv.com/52117acb-b1f7-4ccb-a133-f9caad60fff1"
                className="beehiiv-embed"
                data-test-id="beehiiv-embed"
                frameBorder="0"
                scrolling="no"
                style={{
                  margin: 0,
                  borderRadius: "0px",
                  backgroundColor: "transparent",
                  width: "400px",
                  maxWidth: "100%",
                  height: "47px",
                  boxShadow: "0 0 #0000",
                }}
              />
              <Script
                src="https://subscribe-forms.beehiiv.com/embed.js"
                strategy="lazyOnload"
              />
              <p className="text-xs text-foreground/50 mt-1 text-center max-w-[560px]">
                By joining, you agree to receive updates from us.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex gap-6 pt-4 grayscale opacity-60">
              {/* Placeholder for trusted by logos if needed */}
            </div>
          </div>

          {/* Right Column: App Preview */}
          <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:max-w-none flex items-center justify-center">
            <div className="relative w-[55%] aspect-[9/19.5]">
              <Image
                src="/app-preview.png"
                alt="App Preview"
                fill
                className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-gray-900/10 bg-white"
                priority
              />
            </div>
          </div>

          {/* Original dual-phone preview (restore later) */}
          {/* <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:max-w-none">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-[55%] aspect-[9/19.5] z-10 transform -rotate-2 -translate-x-16 lg:-translate-x-32">
                <Image
                  src="/app-preview.png"
                  alt="App Preview"
                  fill
                  className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-gray-900/10 bg-white"
                  priority
                />
              </div>
              <div className="absolute w-[50%] aspect-[9/19.5] z-0 transform translate-x-16 lg:translate-x-32 translate-y-12 rotate-6 opacity-100">
                <Image
                  src="/app-preview-2.png"
                  alt="App Preview Secondary"
                  fill
                  className="object-cover rounded-[2.5rem] shadow-xl border-4 border-gray-900/10 bg-white"
                  priority
                />
              </div>
            </div>
          </div> */}
        </div>

        {/* Reviews Section */}
        {/* <div className="w-full max-w-5xl mx-auto pt-40 pb-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-foreground/60">
              Join thousands building their Korean habit one character at a time.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "A Wang",
                message: "If you want to speak Korean conversationally in modern world 2026 and be able to travel around Korea recognizing everyday words, Daily Hangul is the app to learn Korean.",
              },
              {
                name: "Syd",
                message: "I am enjoying the app so far! It is a great reminder to actually take time, even a minute or two, to review or learn a new word.",
              },
              {
                name: "Ling San",
                message: "The great thing of the APP is that it shows the Korean characters in the lock screen of your phone to help you remember them. Overall it is a great APP for learning Korean.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="flex flex-col p-6 rounded-2xl bg-accent/50 border border-primary/10 shadow-sm space-y-4"
              >
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed flex-grow">
                  &ldquo;{review.message}&rdquo;
                </p>
                <p className="text-sm font-semibold text-foreground">{review.name}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-40 pb-8 w-full max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lock Screen Hangul</h3>
              <p className="text-sm text-foreground/60 mt-1">Learn effortlessly every time you pick up your phone.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Smart Review</h3>
              <p className="text-sm text-foreground/60 mt-1">Spaced repetition system ensures you never forget.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Track Your Progress</h3>
              <p className="text-sm text-foreground/60 mt-1">Visualize your fluency growth over time.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto py-8 px-6 text-center sm:text-left z-10 border-t border-border/10 mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-foreground/40 gap-4">
          <p>&copy; {new Date().getFullYear()} Daily Hangul.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/support" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div >
  );
}
