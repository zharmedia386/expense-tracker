"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  ShieldCheck,
  ChevronRight,
  Camera,
  Smartphone,
  Mail
} from "lucide-react"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const settingsSections = [
  { id: "profile", name: "Profile", icon: User },
  { id: "security", name: "Security", icon: Lock },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "preferences", name: "Preferences", icon: Globe },
  { id: "billing", name: "Billing", icon: CreditCard },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")
  const [profile, setProfile] = React.useState({
    full_name: "",
    email: "",
    company: "",
    phone: "",
    avatar_url: "",
  })
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [pushNotifications, setPushNotifications] = React.useState(true)
  const [profileSaving, setProfileSaving] = React.useState(false)
  const [notifSaving, setNotifSaving] = React.useState(false)

  React.useEffect(() => {
    async function load() {
      const res = await fetch("/api/profile")
      if (!res.ok) return
      const data = await res.json()
      setProfile((p) => ({
        ...p,
        full_name: data.full_name ?? p.full_name,
        company: data.company ?? p.company,
        phone: data.phone ?? p.phone,
        avatar_url: data.avatar_url ?? p.avatar_url,
      }))
      if (typeof data.email_notifications === "boolean") setEmailNotifications(data.email_notifications)
      if (typeof data.push_notifications === "boolean") setPushNotifications(data.push_notifications)
    }
    load()
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setProfile((p) => ({ ...p, email: user.email ?? p.email }))
    })
  }, [])

  const handleSaveProfile = async () => {
    setProfileSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.full_name,
          company: profile.company,
          phone: profile.phone,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to save profile")
    } finally {
      setProfileSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setNotifSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Notification preferences saved")
    } catch {
      toast.error("Failed to save")
    } finally {
      setNotifSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-white/40 mt-1">Manage your account preferences and security settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 space-y-2"
        >
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                activeSection === section.id
                  ? "bg-[#7b39fc]/10 text-[#9055ff] border border-[#7b39fc]/20"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <section.icon className={`w-5 h-5 ${activeSection === section.id ? "text-[#9055ff]" : "text-gray-500 group-hover:text-white"}`} />
              {section.name}
              <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeSection === section.id ? "rotate-90 text-[#9055ff]" : "text-white/10"}`} />
            </button>
          ))}
        </motion.div>

        {/* Settings Content */}
        <motion.div 
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-3 space-y-8"
        >
          
          {activeSection === "profile" && (
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="p-8 rounded-[32px] bg-white/5 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-8">Personal Information</h3>
                
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="relative shrink-0">
                    <Avatar className="h-24 w-24 border-4 border-white/5 shadow-2xl">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile.full_name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[#7b39fc] text-white shadow-lg hover:bg-[#9055ff] transition-all border-4 border-[#0c0a14]">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                      <Input value={profile.full_name} onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))} className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-[#7b39fc]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                      <Input value={profile.email} disabled className="bg-white/5 border-white/10 h-12 rounded-xl opacity-70" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Company</label>
                      <Input value={profile.company} onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))} className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-[#7b39fc]" placeholder="Company name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">Phone</label>
                      <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-[#7b39fc]" placeholder="+62 812-3456-7890" />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-white/5">
                  <ModernButton variant="secondary" size="md" className="h-11 px-6" onClick={() => fetch("/api/profile").then((r) => r.json()).then((d) => setProfile((p) => ({ ...p, full_name: d.full_name ?? "", company: d.company ?? "", phone: d.phone ?? "" })))}>
                    Discard
                  </ModernButton>
                  <ModernButton variant="primary" size="md" className="h-11 px-8" disabled={profileSaving} onClick={handleSaveProfile}>
                    {profileSaving ? "Saving..." : "Save Changes"}
                  </ModernButton>
                </div>
              </div>

              {/* Account Level */}
              <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#7b39fc]/10 to-transparent border border-[#7b39fc]/20 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7b39fc]/20 flex items-center justify-center border border-[#7b39fc]/30 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 text-[#9055ff]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">ExpenseAI Pro</h4>
                    <p className="text-sm text-white/40">You're currently using the Pro Plan features.</p>
                  </div>
                </div>
                <ModernButton variant="ghost" size="sm" className="text-[#9055ff] hover:bg-[#7b39fc]/10" onClick={() => toast.info("Billing portal coming soon")}>
                  Manage Subscription
                </ModernButton>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-8">
              <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Mail className="w-5 h-5 text-white/40" /></div>
                    <div>
                      <p className="font-semibold text-white">Email Notifications</p>
                      <p className="text-xs text-white/30">Weekly summaries and reports</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><Smartphone className="w-5 h-5 text-white/40" /></div>
                    <div>
                      <p className="font-semibold text-white">Push Notifications</p>
                      <p className="text-xs text-white/30">Immediate alerts for unusual activity</p>
                    </div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white/40" /></div>
                    <div>
                      <p className="font-semibold text-white">Security Alerts</p>
                      <p className="text-xs text-white/30">Login attempts and account changes (always on)</p>
                    </div>
                  </div>
                  <Switch checked disabled />
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-white/5">
                 <ModernButton variant="primary" size="md" className="h-11 px-8" disabled={notifSaving} onClick={handleSaveNotifications}>
                   {notifSaving ? "Saving..." : "Save Notifications"}
                 </ModernButton>
              </div>
            </div>
          )}

          {activeSection !== "profile" && activeSection !== "notifications" && (
            <div className="p-20 text-center rounded-[32px] bg-white/5 border border-white/5 border-dashed">
              <p className="text-white/20 italic">Implementing {activeSection} detailed view...</p>
            </div>
          )}

        </motion.div>
      </div>
    </DashboardLayout>
  )
}
