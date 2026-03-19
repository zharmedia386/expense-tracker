"use client"

import Image from "next/image"
import { Heart, Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "The AI categorization is frighteningly accurate. It saved me at least 5 hours of manual data entry every month.",
    author: "Sarah Jenkins",
    role: "Freelance Designer",
    company: "Creative Agency",
    avatar: "/assets/avatar-sarah.png",
    rating: 5,
  },
  {
    quote: "Finally, an expense tracker that actually understands voice notes. I just talk to it while driving, and it's done.",
    author: "Michael Chen",
    role: "Sales Director",
    company: "TechFlow Inc.",
    avatar: "/assets/avatar-michael.png",
    rating: 5,
  },
  {
    quote: "The insights helped me identify $200/mo in unused subscriptions. The app paid for itself in the first week.",
    author: "Emma Watson",
    role: "Account Manager",
    company: "Marketing Co.",
    avatar: "/assets/avatar-emma.png",
    rating: 5,
  },
  {
    quote: "We've reduced our expense processing time by 80% since switching to this platform. The ROI was evident within the first month.",
    author: "David Park",
    role: "CFO",
    company: "StartupXYZ",
    avatar: "/assets/avatar-david.png",
    rating: 5,
  },
  {
    quote: "The multi-currency support is fantastic for our international team. Exchange rates are handled automatically and reports are always accurate.",
    author: "Anna Kowalski",
    role: "Operations Lead",
    company: "EuroTech GmbH",
    avatar: "/assets/avatar-anna.png",
    rating: 5,
  },
  {
    quote: "Finally, an expense tracker that understands context. It knows the difference between a business lunch and personal dining automatically.",
    author: "James Liu",
    role: "Product Manager",
    company: "Innovation Labs",
    avatar: "/assets/avatar-james.png",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative bg-[#0c0a14] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[120px] overflow-hidden" id="reviews">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[400px] sm:h-[600px] bg-[#7b39fc]/8 rounded-full blur-[120px] sm:blur-[180px]" />
        
        {/* Top accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[150px] sm:h-[200px] bg-[#9055ff]/10 rounded-full blur-[80px] sm:blur-[100px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-[10%] w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] bg-[#7b39fc]/20 rounded-full blur-[40px] sm:blur-[60px] animate-pulse" />
        <div className="absolute bottom-1/4 right-[10%] w-[100px] sm:w-[150px] h-[100px] sm:h-[150px] bg-[#9055ff]/15 rounded-full blur-[50px] sm:blur-[70px] animate-pulse delay-500" />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7b39fc]/20 to-[#9055ff]/10 border border-[#7b39fc]/30 mb-6 shadow-[0_0_30px_rgba(123,57,252,0.15)]">
            <Heart className="w-4 h-4 text-[#9055ff]" />
            <span className="font-[family-name:var(--font-cabin)] text-sm text-[#9055ff]">Testimonials</span>
          </div>
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6">
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
          </h2>
          <p className="font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg max-w-xl mx-auto px-4">
            Join over 50,000 professionals who have simplified their expense management with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="group relative p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#7b39fc]/40 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
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
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 shadow-lg shadow-[#7b39fc]/20">
                  <Image src={testimonial.avatar} alt={testimonial.author} width={40} height={40} className="w-full h-full object-cover" />
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
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { value: "50K+", label: "Active Users" },
            { value: "10M+", label: "Expenses Tracked" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9/5", label: "User Rating" },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="relative text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/5 overflow-hidden group hover:border-[#7b39fc]/30 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7b39fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <p className="relative font-[family-name:var(--font-inter)] text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="relative font-[family-name:var(--font-cabin)] text-white/40 text-xs sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
