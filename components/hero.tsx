import { ModernButton } from "./modern-button"
import { FileSpreadsheet, FileText, Image, MessageSquare, Mic } from "lucide-react"

const supportedFormats = [
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: FileText, label: "Docs" },
  { icon: Image, label: "Images" },
  { icon: MessageSquare, label: "Text" },
  { icon: Mic, label: "Voice" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Enhanced overlay with purple tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0c0a14]/30 to-[#0c0a14]" />
      
      {/* Purple ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#7b39fc]/15 rounded-full blur-[150px]" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 py-24 lg:py-32 max-w-5xl mx-auto">
        {/* Tagline Pill */}
        <div className="flex items-center gap-2 h-[38px] px-3 rounded-full bg-[rgba(85,80,110,0.4)] backdrop-blur-md border border-[rgba(164,132,215,0.5)] shadow-[0_0_30px_rgba(123,57,252,0.3)]">
          <span className="px-2 py-1 bg-gradient-to-r from-[#9055ff] to-[#7b39fc] rounded-full font-[family-name:var(--font-cabin)] font-medium text-xs sm:text-sm text-white shadow-lg">
            New
          </span>
          <span className="font-[family-name:var(--font-cabin)] font-medium text-xs sm:text-sm text-white">
            Powered by OpenClaw AI
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-6 sm:mt-8 font-[family-name:var(--font-instrument-serif)] text-white text-4xl sm:text-5xl lg:text-[80px] xl:text-[96px] leading-[1.1] text-balance">
          Track every expense{" "}
          <em className="italic bg-gradient-to-r from-[#9055ff] to-[#c084fc] bg-clip-text text-transparent">with AI</em>
        </h1>

        {/* Subtext */}
        <p className="mt-4 sm:mt-6 font-[family-name:var(--font-inter)] font-normal text-base sm:text-lg text-white/70 max-w-[662px] text-pretty px-4">
          Send any format - Excel, documents, images, voice, or text. OpenClaw AI automatically 
          categorizes expenses and generates insights in seconds.
        </p>

        {/* Supported Formats */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {supportedFormats.map((format) => (
            <div
              key={format.label}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <format.icon className="w-4 h-4 text-[#9055ff]" />
              <span className="font-[family-name:var(--font-cabin)] text-white/70 text-xs sm:text-sm">
                {format.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <ModernButton variant="primary" size="md" className="w-full sm:w-auto">
            Start Free Trial
          </ModernButton>
          <ModernButton variant="secondary" size="md" className="w-full sm:w-auto">
            View Demo
          </ModernButton>
        </div>

        {/* Trust badges */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3">
          <p className="font-[family-name:var(--font-cabin)] text-white/40 text-xs sm:text-sm">
            Trusted by 50,000+ professionals worldwide
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            {["SOC 2", "GDPR", "256-bit SSL"].map((badge) => (
              <div
                key={badge}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-[family-name:var(--font-cabin)] text-white/50 text-xs backdrop-blur-sm"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
