"use client"

import { Twitter, Github, Linkedin, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

const footerLinks = {
  Product: [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Integrations", href: "#" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
    { label: "Community", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Security", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function Footer() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <footer ref={ref} className="relative bg-[#0c0a14] pt-16 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-[120px] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-[#7b39fc]/40 to-transparent" />
        
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] sm:h-[500px] bg-[#7b39fc]/5 rounded-full blur-[150px] sm:blur-[200px]" />
        
        {/* Side accents */}
        <div className="absolute bottom-1/4 left-0 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-[#9055ff]/5 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[150px] sm:w-[250px] h-[150px] sm:h-[250px] bg-[#4a2090]/10 rounded-full blur-[70px] sm:blur-[100px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative max-w-7xl mx-auto"
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Logo & Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <svg width="32" height="32" viewBox="0 0 159 153" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M102.414 87.9698L80.0697 153L56.9484 87.9698H0.790039L79.2906 0L159.21 87.9698H102.414Z" fill="url(#footerGrad)"/>
                <defs>
                  <linearGradient id="footerGrad" x1="80" y1="0" x2="80" y2="153" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9055FF"/>
                    <stop offset="1" stopColor="#6B2FD6"/>
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-[family-name:var(--font-manrope)] text-white text-lg sm:text-xl font-bold">
                ExpenseAI
              </span>
            </div>
            <p className="font-[family-name:var(--font-inter)] text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              AI-powered expense tracking for modern teams. Send any format, get instant insights with OpenClaw.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#9055ff] hover:bg-[#7b39fc]/10 hover:border-[#7b39fc]/30 transition-all"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-[family-name:var(--font-cabin)] text-white font-semibold text-sm mb-3 sm:mb-4">
                {category}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-[family-name:var(--font-inter)] text-white/40 text-sm hover:text-[#9055ff] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="py-6 sm:py-8 border-t border-b border-white/10 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div>
              <h4 className="font-[family-name:var(--font-manrope)] text-white font-semibold text-base sm:text-lg mb-1">
                Stay up to date
              </h4>
              <p className="font-[family-name:var(--font-inter)] text-white/50 text-sm">
                Get the latest updates, tips, and exclusive content delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full lg:w-72 h-11 sm:h-12 px-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder:text-white/40 font-[family-name:var(--font-inter)] text-sm focus:outline-none focus:border-[#7b39fc]/50 focus:ring-2 focus:ring-[#7b39fc]/20 transition-all"
              />
              <button className="h-11 sm:h-12 px-6 bg-gradient-to-b from-[#9055ff] to-[#6b2fd6] text-white rounded-lg sm:rounded-xl font-[family-name:var(--font-cabin)] font-medium text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_12px_-2px_rgba(123,57,252,0.4)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_6px_16px_-2px_rgba(123,57,252,0.5)] transition-all active:scale-[0.98]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-[family-name:var(--font-inter)] text-white/30 text-sm">
            2024 ExpenseAI. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="font-[family-name:var(--font-inter)] text-white/30 text-sm hover:text-[#9055ff] transition-colors">
              Privacy
            </a>
            <a href="#" className="font-[family-name:var(--font-inter)] text-white/30 text-sm hover:text-[#9055ff] transition-colors">
              Terms
            </a>
            <a href="#" className="font-[family-name:var(--font-inter)] text-white/30 text-sm hover:text-[#9055ff] transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
