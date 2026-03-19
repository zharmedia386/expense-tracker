"use client"

import { Zap, Shield, BarChart3, Clock, Rocket, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

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
  const { ref, isVisible } = useScrollReveal()

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-[120px]" id="features">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything you need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b39fc] to-[#bca1ff]">
              take control of your money
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stop guessing where your money goes. Get a clear, automated overview of your financial health with our cutting-edge feature set.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={cardVariants}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-[#7b39fc]/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#7b39fc]/10 flex items-center justify-center mb-6 border border-[#7b39fc]/20 group-hover:scale-110 group-hover:bg-[#7b39fc]/20 transition-all">
                <feature.icon className="w-6 h-6 text-[#7b39fc]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
