"use client"

import { Zap, Shield, BarChart3, Clock, Rocket, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Scan receipts and invoices with high precision OCR that categorizes transparency in seconds.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Your data is encrypted using AES-256 and never sold to third parties. Privacy is our priority.",
  },
  {
    icon: BarChart3,
    title: "Smart Insights",
    description: "AI-driven analytics that identify spending patterns and suggest practical ways to save money.",
  },
  {
    icon: Clock,
    title: "Subscription Tracking",
    description: "Identify and manage recurring payments. Get notified before trials end or prices increase.",
  },
  {
    icon: Rocket,
    title: "Future Projections",
    description: "ML models that predict your future cash flow based on historical data and planned goals.",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Track expenses globally with real-time exchange rates and localized tax calculations.",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative bg-[#0c0a14] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[120px] overflow-hidden" id="features">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7b39fc]/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4a2090]/5 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6">
            Everything you need for <br />
            <em className="italic bg-gradient-to-r from-[#9055ff] via-[#c084fc] to-[#9055ff] bg-clip-text text-transparent">
              total control
            </em>
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg max-w-xl mx-auto px-4">
            Powerful tools designed to help you manage your money smarter, faster, and with complete confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#7b39fc]/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#7b39fc] to-[#4a2090] flex items-center justify-center mb-6 sm:mb-8 shadow-lg shadow-[#7b39fc]/20 group-hover:shadow-[#7b39fc]/40 transition-shadow">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="font-[family-name:var(--font-manrope)] text-white text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                {feature.title}
              </h3>
              <p className="font-[family-name:var(--font-inter)] text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
