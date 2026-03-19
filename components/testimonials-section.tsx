"use client"

import { useEffect, useState } from "react"
import { Star, Quote } from "lucide-react"
import { motion, animate } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

const testimonials = [
  {
    quote: "OpenClaw has completely transformed how we handle expense reports. What used to take hours now takes minutes. The AI categorization is incredibly accurate.",
    author: "Sarah Chen",
    role: "Finance Director",
    company: "TechFlow Inc.",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "I just snap a photo of my receipts and everything is automatically processed. No more lost receipts or manual data entry. It's like magic.",
    author: "Marcus Rodriguez",
    role: "Sales Executive",
    company: "Global Sales Co.",
    avatar: "MR",
    rating: 5,
  },
  {
    quote: "The voice memo feature is a game-changer for me. I can record expenses while driving between client meetings and it all gets tracked perfectly.",
    author: "Emily Watson",
    role: "Account Manager",
    company: "Creative Agency",
    avatar: "EW",
    rating: 5,
  },
  {
    quote: "We've reduced our expense processing time by 80% since switching to this platform. The ROI was evident within the first month.",
    author: "David Park",
    role: "CFO",
    company: "StartupXYZ",
    avatar: "DP",
    rating: 5,
  },
  {
    quote: "The multi-currency support is fantastic for our international team. Exchange rates are handled automatically and reports are always accurate.",
    author: "Anna Kowalski",
    role: "Operations Lead",
    company: "EuroTech GmbH",
    avatar: "AK",
    rating: 5,
  },
  {
    quote: "Finally, an expense tracker that understands context. It knows the difference between a business lunch and personal dining automatically.",
    author: "James Liu",
    role: "Product Manager",
    company: "Innovation Labs",
    avatar: "JL",
    rating: 5,
  },
]

function AnimatedStat({ value, suffix, decimals = 0, isVisible }: { value: number; suffix: string; decimals?: number; isVisible: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isVisible) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(latest),
      })
      return () => controls.stop()
    }
  }, [isVisible, value])

  return <span>{displayValue.toFixed(decimals)}{suffix}</span>
}

const statsData: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 50, suffix: "K+", label: "Active Users" },
  { value: 10, suffix: "M+", label: "Expenses Tracked" },
  { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
  { value: 4.9, suffix: "/5", label: "User Rating", decimals: 1 },
]

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal()
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal()

  return (
    <section ref={ref} className="relative bg-[#0c0a14] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[120px] overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-[#7b39fc]/8 rounded-full blur-[120px] sm:blur-[180px]" />
        
        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[150px] sm:h-[200px] bg-[#9055ff]/10 rounded-full blur-[80px] sm:blur-[100px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/6 w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] bg-[#7b39fc]/20 rounded-full blur-[40px] sm:blur-[60px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] bg-[#9055ff]/15 rounded-full blur-[50px] sm:blur-[70px] animate-pulse delay-500" />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7b39fc]/20 to-[#9055ff]/10 border border-[#7b39fc]/30 shadow-[0_0_30px_rgba(123,57,252,0.15)] mb-6"
          >
            <Star className="w-4 h-4 text-[#9055ff]" />
            <span className="font-[family-name:var(--font-cabin)] text-sm text-[#9055ff]">Trusted by teams</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6"
          >
            Loved by{" "}
            <em className="italic relative inline-block">
              <span className="bg-gradient-to-r from-[#9055ff] via-[#c084fc] to-[#e879f9] bg-clip-text text-transparent">
                thousands
              </span>
              {/* Sparkle decorations */}
              <svg className="absolute -top-2 -right-6 w-5 h-5 sm:w-6 sm:h-6 text-[#9055ff]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </em>
          </motion.h2>
          <p className="font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg max-w-xl mx-auto px-4">
            Join over 50,000 professionals who have simplified their expense management with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.08, ease: "easeOut" }}
              className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#7b39fc]/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7b39fc]/10 to-[#9055ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Inner shadow */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" />
              
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-[#7b39fc]/20" />
              
              {/* Rating */}
              <div className="relative flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="relative font-[family-name:var(--font-inter)] text-white/80 text-sm sm:text-base leading-relaxed mb-5 sm:mb-6">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#7b39fc] to-[#4a2090] flex items-center justify-center shadow-lg shadow-[#7b39fc]/20">
                  <span className="font-[family-name:var(--font-cabin)] text-white text-xs sm:text-sm font-medium">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-manrope)] text-white font-semibold text-sm">
                    {testimonial.author}
                  </p>
                  <p className="font-[family-name:var(--font-inter)] text-white/40 text-xs">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={statsVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="relative text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/5 overflow-hidden group hover:border-[#7b39fc]/30 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7b39fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <p className="relative font-[family-name:var(--font-inter)] text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  isVisible={statsVisible}
                />
              </p>
              <p className="relative font-[family-name:var(--font-cabin)] text-white/40 text-xs sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
