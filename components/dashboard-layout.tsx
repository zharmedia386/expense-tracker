"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
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
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-[#0c0a14] text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0c0a14] sticky top-0 h-screen transition-all">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7b39fc] to-[#9055ff] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(123,57,252,0.4)]">
              E
            </div>
            <span className="font-bold text-xl tracking-tight">ExpenseAI</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? "bg-[#7b39fc]/10 text-[#9055ff]" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#9055ff]" : "text-gray-500 group-hover:text-white"}`} />
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-accent"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7b39fc] shadow-[0_0_10px_rgba(123,57,252,1)]"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <Link
            href="/support"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <HelpCircle className="w-5 h-5 text-gray-500" />
            Support
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:bg-red-400/10 hover:text-red-400 transition-all text-left mt-1">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 bg-[#0c0a14]/80 backdrop-blur-xl sticky top-0 z-30">
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96 group focus-within:border-[#7b39fc]/50 transition-all">
            <Search className="w-4 h-4 text-white/30 group-focus-within:text-[#7b39fc]" />
            <Input 
              placeholder="Search expenses, files, insights..." 
              className="bg-transparent border-none focus-visible:ring-0 text-sm h-auto py-0 placeholder:text-white/20"
            />
            <kbd className="hidden sm:flex text-[10px] text-white/20 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded ml-2">⌘K</kbd>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <Button size="icon" variant="ghost" className="relative text-white/50 hover:text-white rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#7b39fc] rounded-full border-2 border-[#0c0a14]" />
            </Button>
            
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white group-hover:text-[#9055ff] transition-colors">Azhar</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Pro Plan</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-white/10 group-hover:border-[#7b39fc] transition-all">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AZ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.aside 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            className="absolute top-0 left-0 bottom-0 w-80 bg-[#0c0a14] border-r border-white/5 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-10">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#7b39fc] flex items-center justify-center font-bold text-white">E</div>
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
            </nav>
          </motion.aside>
        </div>
      )}
    </div>
  )
}
