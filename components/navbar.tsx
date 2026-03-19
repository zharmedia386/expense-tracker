"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import Image from "next/image"
import { ModernButton } from "./modern-button"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-[120px] py-4">
        {/* Scrolled background — fades in smoothly, never snaps */}
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out pointer-events-none"
          style={{ opacity: scrolled ? 1 : 0 }}
          aria-hidden="true"
        >
          {/* Dark frosted glass fill */}
          <div className="absolute inset-0 bg-[#0c0a14]/80 backdrop-blur-xl" />
          {/* Bottom border line — same gradient style as footer/section-divider */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7b39fc]/40 to-transparent" />
          {/* Subtle purple shadow */}
          <div className="absolute inset-0 shadow-[0_4px_30px_rgba(123,57,252,0.1)]" />
        </div>
        <div className="relative flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Image src="/assets/logo.png" alt="ExpenseAI" width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="font-[family-name:var(--font-manrope)] text-white text-lg font-bold hidden sm:block">
              ExpenseAI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 ml-12">
            <a
              href="#"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Home
            </a>
            <button className="flex items-center gap-1 font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors">
              Services
              <ChevronDown className="w-4 h-4" />
            </button>
            <a
              href="#"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Reviews
            </a>
            <a
              href="#"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Contact us
            </a>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <ModernButton variant="ghost" size="sm">
              Sign In
            </ModernButton>
            <ModernButton variant="primary" size="sm">
              Get Started
            </ModernButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 -mr-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c0a14]/98 backdrop-blur-xl">
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-12">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Image src="/assets/logo.png" alt="ExpenseAI" width={32} height={32} className="w-8 h-8 object-contain brightness-0 invert" />
                <span className="font-[family-name:var(--font-manrope)] text-white text-lg font-bold">
                  ExpenseAI
                </span>
              </div>
              <button
                className="text-white p-2 -mr-2"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              <a
                href="#"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <button className="flex items-center gap-2 font-[family-name:var(--font-manrope)] font-medium text-2xl text-white text-left">
                Services
                <ChevronDown className="w-5 h-5" />
              </button>
              <a
                href="#"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <a
                href="#"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us
              </a>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <ModernButton variant="outline" size="md" className="w-full">
                Sign In
              </ModernButton>
              <ModernButton variant="primary" size="md" className="w-full">
                Get Started
              </ModernButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
