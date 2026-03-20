"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, Menu, Settings, LogOut, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModernButton } from "./modern-button"

export function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<{ full_name?: string; avatar_url?: string } | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function setUserFromAuth(authUser: { id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null) {
      if (!authUser) {
        setUser(null)
        return
      }
      let fullName = authUser.user_metadata?.full_name
      let avatarUrl = authUser.user_metadata?.avatar_url
      
      const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", authUser.id).single()
      fullName = profile?.full_name || fullName || authUser.email?.split("@")[0] || "User"
      avatarUrl = profile?.avatar_url || avatarUrl
      
      setUser({ full_name: fullName, avatar_url: avatarUrl })
    }

    supabase.auth.getUser().then(({ data: { user } }) => setUserFromAuth(user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserFromAuth(session?.user ?? null)
    })
    
    const handleUpdate = () => {
      supabase.auth.getUser().then(({ data: { user } }) => setUserFromAuth(user))
    }
    
    window.addEventListener("avatarUpdated", handleUpdate)
    window.addEventListener("profileUpdated", handleUpdate)
    
    return () => {
      subscription.unsubscribe()
      window.removeEventListener("avatarUpdated", handleUpdate)
      window.removeEventListener("profileUpdated", handleUpdate)
    }
  }, [])

  async function handleLogout() {
    await createClient().auth.signOut()
    setUser(null)
    setMobileMenuOpen(false)
    router.push("/")
    router.refresh()
  }

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
            <Link
              href="/"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Home
            </Link>
            <button className="flex items-center gap-1 font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors">
              Services
              <ChevronDown className="w-4 h-4" />
            </button>
            <Link
              href="/#reviews"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Reviews
            </Link>
            <Link
              href="/#about"
              className="font-[family-name:var(--font-manrope)] font-medium text-sm text-white hover:text-[#9055ff] transition-colors"
            >
              Contact us
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 pl-2 pr-2 py-1.5 rounded-xl group cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white group-hover:text-[#9055ff] transition-colors">
                        {user.full_name}
                      </p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">Pro Plan</p>
                    </div>
                    <Avatar className="h-9 w-9 border-2 border-white/10 group-hover:border-[#7b39fc] transition-all">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.full_name?.split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-[#0c0a14] border-white/10 text-white">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer focus:bg-white/10">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer focus:bg-white/10">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-red-500/20 text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <ModernButton variant="ghost" size="sm">
                    Sign In
                  </ModernButton>
                </Link>
                <Link href="/register">
                  <ModernButton variant="primary" size="sm">
                    Get Started
                  </ModernButton>
                </Link>
              </>
            )}
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
              <Link
                href="/"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <button className="flex items-center gap-2 font-[family-name:var(--font-manrope)] font-medium text-2xl text-white text-left">
                Services
                <ChevronDown className="w-5 h-5" />
              </button>
              <Link
                href="/#reviews"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </Link>
              <Link
                href="/#about"
                className="font-[family-name:var(--font-manrope)] font-medium text-2xl text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us
              </Link>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                      <Avatar className="h-10 w-10 border-2 border-white/10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.full_name?.split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{user.full_name}</p>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Pro Plan</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-white/40" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="top" className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] bg-[#0c0a14] border-white/10 text-white">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer focus:bg-white/10 py-3">
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)} className="cursor-pointer focus:bg-white/10 py-3">
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer focus:bg-red-500/20 text-red-400 py-3">
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <ModernButton variant="outline" size="md" className="w-full">
                      Sign In
                    </ModernButton>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <ModernButton variant="primary" size="md" className="w-full">
                      Get Started
                    </ModernButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
