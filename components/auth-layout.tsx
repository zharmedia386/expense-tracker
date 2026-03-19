"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  videoSrc?: string
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4" 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-[#0c0a14] flex overflow-hidden">
      {/* Left Side: Video (Hidden on small screens) */}
      <div className="hidden lg:block relative w-1/2 h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Overlay for better text contrast if needed, but here it's just for the vibe */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0c0a14]/60 via-transparent to-transparent" />
        
        {/* Branding/Quote Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Master Your Wealth with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9055ff] to-[#c084fc]">
                Intelligent Insights
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-md">
              Join 50,000+ professionals using AI to optimize their financial future.
            </p>
          </motion.div>
        </div>

        {/* Floating Gradient Blob */}
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-[#7b39fc]/20 blur-[100px] rounded-full" />
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-20 relative overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-white/40 hover:text-white transition-colors mb-8 group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
              <p className="text-white/50 mt-2">{subtitle}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>

          <footer className="pt-20 text-center">
            <p className="text-xs text-white/30">
              © 2024 ExpenseAI. Securely managed financial automation.
            </p>
          </footer>
        </div>

        {/* Ambient glow for the form side too */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#7b39fc]/5 blur-[120px] rounded-full pointer-events-none" />
      </div>
    </div>
  )
}
