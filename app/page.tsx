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
            "name": "Daily Hanzi",
            "operatingSystem": "iOS, Android",
            "applicationCategory": "EducationalApplication",
            "description": "Master Chinese characters (Hanzi) effortlessly on your lock screen with daily spaced repetition.",
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
            alt="Daily Hanzi Logo"
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
                <span>#1 Chinese lock screen learning app</span>
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Master Chinese Daily<br />
                <span className="text-primary text-3xl sm:text-5xl block mt-2">
                  from Your Lock Screen
                </span>
              </h1>
              <p className="text-lg sm:text-lg text-foreground/60 leading-relaxed max-w-md">
                Build a new daily habit of learning Chinese the easiest way possible. Seamlessly integrated directly into your lock screen.
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="w-full pt-2 flex flex-col items-center">
              <iframe
                src="https://subscribe-forms.beehiiv.com/78bf7849-7b4e-47cc-9148-e8893c4185bb"
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
          <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:max-w-none">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Phone */}
              <div className="relative w-[55%] aspect-[9/19.5] z-10 transform -rotate-2 -translate-x-16 lg:-translate-x-32">
                <Image
                  src="/app-preview.png"
                  alt="App Preview"
                  fill
                  className="object-cover rounded-[2.5rem] shadow-2xl border-4 border-gray-900/10 bg-white"
                  priority
                />
              </div>
              {/* Secondary Phone (Floating Right) */}
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
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-40 pb-8 w-full max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lock Screen Hanzi</h3>
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
          <p>&copy; {new Date().getFullYear()} Daily Hanzi.</p>
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
