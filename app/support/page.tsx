"use client"

import * as React from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { HelpCircle, Mail, MessageCircle, ChevronRight, Book } from "lucide-react"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SupportPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const [user, setUser] = React.useState<{ email?: string } | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!u) router.replace("/login?redirect=/support")
      else setUser({ email: u.email })
    })
  }, [mounted, router])

  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="p-20 text-center text-white/40">Loading...</div>
      </DashboardLayout>
    )
  }

  const supportLinks = [
    { href: "mailto:support@expenseai.app", icon: Mail, title: "Email Support", desc: "Get help via email within 24 hours" },
    { href: "/dashboard/chat", icon: MessageCircle, title: "AI Assistant", desc: "Ask questions about your expenses" },
    { href: "#", icon: Book, title: "Help Center", desc: "Browse guides and FAQs" },
  ]

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Support</h1>
        <p className="text-white/40 mt-1">Get help with ExpenseAI</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {supportLinks.map((item, i) => (
          <motion.a
            key={item.title}
            href={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="block p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-[#7b39fc]/20 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7b39fc]/10 flex items-center justify-center group-hover:bg-[#7b39fc]/20">
                <item.icon className="w-6 h-6 text-[#9055ff]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-white/40 mt-0.5">{item.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-[#9055ff]" />
            </div>
          </motion.a>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 p-8 rounded-[32px] bg-white/5 border border-white/10"
      >
        <h3 className="text-xl font-bold text-white mb-4">Contact us</h3>
        <p className="text-white/40 text-sm mb-6">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.currentTarget
            const subject = (form.querySelector('[name="subject"]') as HTMLInputElement)?.value
            const body = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value
            window.open(`mailto:support@expenseai.app?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`)
          }}
          className="space-y-4 max-w-xl"
        >
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Subject</label>
            <Input name="subject" placeholder="How can we help?" className="mt-1 bg-white/5 border-white/10 h-11" />
          </div>
          <div>
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Message</label>
            <textarea
              name="message"
              placeholder="Describe your issue or question..."
              rows={4}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm resize-none focus:outline-none focus:border-[#7b39fc]"
            />
          </div>
          <ModernButton type="submit" variant="primary" size="md">
            Open Email
          </ModernButton>
        </form>
      </motion.div>
    </DashboardLayout>
  )
}
