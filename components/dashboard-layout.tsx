"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Search,
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const [user, setUser] = React.useState<{ full_name?: string; email?: string; avatar_url?: string } | null>(null)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  React.useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        let fullName = authUser.user_metadata?.full_name
        let avatarUrl = authUser.user_metadata?.avatar_url
        if (!fullName) {
          const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", authUser.id).single()
          fullName = profile?.full_name || authUser.email?.split("@")[0] || "User"
          avatarUrl = profile?.avatar_url || avatarUrl
        }
        setUser({
          full_name: fullName,
          email: authUser.email,
          avatar_url: avatarUrl,
        })
      }
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0c0a14] text-white flex">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="hidden lg:flex flex-col border-r border-white/5 bg-[#0c0a14] fixed top-0 left-0 h-screen z-40"
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0c0a14] z-10">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/assets/logo.png" alt="ExpenseAI" width={32} height={32} className="w-8 h-8 object-contain" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="font-bold text-xl tracking-tight whitespace-nowrap overflow-hidden"
                >
                  ExpenseAI
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scrollbar">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive 
                    ? "bg-[#7b39fc]/10 text-[#9055ff]" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
                title={isCollapsed ? item.name : ""}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#9055ff]" : "text-gray-500 group-hover:text-white"}`} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="sidebar-accent"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7b39fc] shadow-[0_0_10px_rgba(123,57,252,1)]"
                  />
                )}
                {isActive && isCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#7b39fc] rounded-l-full shadow-[0_0_10px_rgba(123,57,252,1)]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer - Non-scrollable */}
        <div className="p-4 border-t border-white/5 bg-[#0c0a14] z-10">
          <div className="space-y-1">
            <Link
              href="/dashboard/chat"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group overflow-hidden ${
                pathname === "/dashboard/chat"
                  ? "bg-[#7b39fc]/10 text-[#9055ff]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
              title={isCollapsed ? "AI Assistant" : ""}
            >
              <div className="relative">
                <LayoutDashboard className={`w-5 h-5 shrink-0 ${pathname === "/dashboard/chat" ? "text-[#9055ff]" : "text-gray-500 group-hover:text-white"}`} />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#7b39fc] rounded-full border border-[#0c0a14] animate-pulse" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    AI Assistant
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link
              href="/support"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all overflow-hidden"
              title={isCollapsed ? "Support" : ""}
            >
              <HelpCircle className="w-5 h-5 text-gray-500 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Support
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-all text-left overflow-hidden"
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        initial={false}
        animate={{ paddingLeft: isMobile ? 0 : (isCollapsed ? 80 : 256) }}
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
      >
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-[#0c0a14]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-72 lg:w-96 group focus-within:border-[#7b39fc]/50 transition-all">
              <Search className="w-4 h-4 text-white/30 group-focus-within:text-[#7b39fc]" />
              <Input 
                placeholder="Search expenses, files, insights..." 
                className="bg-transparent border-none focus-visible:ring-0 text-sm h-auto py-0 placeholder:text-white/20"
              />
              <kbd className="hidden sm:flex text-[10px] text-white/20 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Button size="icon" variant="ghost" className="relative text-white/50 hover:text-white rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#7b39fc] rounded-full border-2 border-[#0c0a14]" />
            </Button>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white group-hover:text-[#9055ff] transition-colors">
                  {user?.full_name || "Loading..."}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">
                  {user?.email ? "Pro Plan" : ""}
                </p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white/10 group-hover:border-[#7b39fc] transition-all">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback>
                  {user?.full_name
                    ? user.full_name.split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {children}
          </div>
        </div>
      </motion.main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-80 bg-[#0c0a14] border-r border-white/5 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/assets/logo.png" alt="ExpenseAI" width={32} height={32} className="w-8 h-8 object-contain" />
                  <span className="font-bold text-xl">ExpenseAI</span>
                </Link>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-medium text-white/70 hover:bg-white/5 hover:text-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/dashboard/chat"
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-medium text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <LayoutDashboard className="w-6 h-6" />
                  AI Assistant
                </Link>
                <Link
                  href="/support"
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-medium text-white/70 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <HelpCircle className="w-6 h-6" />
                  Support
                </Link>
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
