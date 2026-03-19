"use client"

import { motion } from "framer-motion"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useEffect, useState } from "react"

const testimonials = [
  {
    quote: "The AI categorization is frighteningly accurate. It saved me at least 5 hours of manual data entry every month.",
    author: "Sarah Jenkins",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "Finally, an expense tracker that actually understands voice notes. I just talk to it while driving, and it's done.",
    author: "Michael Chen",
    role: "Sales Director",
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    quote: "The insights helped me identify $200/mo in unused subscriptions. The app paid for itself in the first week.",
    author: "Emma Rodriguez",
    role: "Marketing Manager",
    avatar: "https://i.pravatar.cc/150?u=emma"
  }
]

const stats = [
  { label: "Active Users", value: 50000, suffix: "+" },
  { label: "Expenses Tracked", value: 12, suffix: "M+" },
  { label: "Hours Saved/mo", value: 15, suffix: "" },
  { label: "Accuracy Rate", value: 99.9, suffix: "%" }
]

function CountUp({ value, suffix, isVisible }: { value: number; suffix: string; isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, value])

  return (
    <span>
      {Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  )
}

export function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-[120px]" id="reviews">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Loved by thousands of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7b39fc] to-[#bca1ff]">
              smart spenders
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col h-full"
            >
              <div className="flex-1">
                <p className="text-white/80 italic mb-8 leading-relaxed">"{testimonial.quote}"</p>
              </div>
              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full border border-[#7b39fc]/30" />
                <div>
                  <h4 className="text-white font-bold">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-white/5 bg-white/[0.02] rounded-[40px] px-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <CountUp value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </h3>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
