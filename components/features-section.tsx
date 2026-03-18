"use client"

import { 
  FileSpreadsheet, 
  FileText, 
  Image, 
  MessageSquare, 
  Mic, 
  Sparkles,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Globe
} from "lucide-react"
import { motion } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

const inputTypes = [
  { icon: FileSpreadsheet, label: "Excel", color: "from-emerald-500 to-emerald-600" },
  { icon: FileText, label: "Documents", color: "from-blue-500 to-blue-600" },
  { icon: Image, label: "Images", color: "from-pink-500 to-pink-600" },
  { icon: MessageSquare, label: "Text", color: "from-amber-500 to-amber-600" },
  { icon: Mic, label: "Voice", color: "from-purple-500 to-purple-600" },
]

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "OpenClaw analyzes your expenses using advanced AI to categorize, detect patterns, and provide actionable insights automatically.",
    gradient: "from-[#7b39fc] to-[#4a2090]",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Upload any format and get results in seconds. No manual data entry required - just send and let AI do the work.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your financial data is encrypted end-to-end with enterprise-grade security protocols and SOC 2 compliance.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: BarChart3,
    title: "Smart Reports",
    description: "Generate beautiful, comprehensive reports with a single click. Export to PDF, Excel, or share directly with your team.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Clock,
    title: "Real-Time Sync",
    description: "Connect your bank accounts and credit cards for automatic expense tracking. Updates happen in real-time.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Track expenses in 150+ currencies with automatic conversion rates. Perfect for international teams and travelers.",
    gradient: "from-cyan-500 to-blue-600",
  },
]

export function FeaturesSection() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className="relative bg-[#0c0a14] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-[120px] overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[400px] sm:h-[600px] bg-[#7b39fc]/10 rounded-full blur-[150px] sm:blur-[200px]" />
        
        {/* Side glows */}
        <div className="absolute top-1/4 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#7b39fc]/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#4a2090]/10 rounded-full blur-[100px] sm:blur-[120px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,57,252,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(123,57,252,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_100%)]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7b39fc]/20 to-[#9055ff]/10 border border-[#7b39fc]/30 mb-6 shadow-[0_0_30px_rgba(123,57,252,0.2)]"
          >
            <Sparkles className="w-4 h-4 text-[#9055ff]" />
            <span className="font-[family-name:var(--font-cabin)] text-sm text-[#9055ff]">Powered by OpenClaw AI</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-6xl mb-4 sm:mb-6 text-balance"
          >
            Send anything,{" "}
            <em className="italic relative">
              <span className="bg-gradient-to-r from-[#9055ff] via-[#c084fc] to-[#9055ff] bg-clip-text text-transparent">
                get insights
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9055ff]/50 to-transparent" />
            </em>
          </motion.h2>
          
          <p className="font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
            OpenClaw understands any format you throw at it. Upload spreadsheets, snap receipt photos, 
            record voice memos, or just type - we handle it all.
          </p>
        </div>

        {/* Input Types Showcase */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16 sm:mb-20 px-4">
          {inputTypes.map((type, index) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative"
            >
              <div className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#7b39fc]/50 transition-all duration-300 hover:scale-105 cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${type.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300`} />
                
                <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg`}>
                  <type.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="relative font-[family-name:var(--font-cabin)] text-white font-medium text-sm sm:text-base">
                  {type.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#7b39fc]/30 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl`} />
              
              {/* Inner shadow effect */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" />
              
              {/* Icon */}
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-black/20`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="relative font-[family-name:var(--font-manrope)] text-white text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="relative font-[family-name:var(--font-inter)] text-white/50 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
              
              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-6 right-6 sm:left-8 sm:right-8 h-px bg-gradient-to-r from-transparent ${feature.gradient} to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
