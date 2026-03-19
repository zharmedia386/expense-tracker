"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AuthLayout } from "@/components/auth-layout"
import { ModernButton } from "@/components/modern-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Chrome, Github } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("name") as string

    if (!email || !password) {
      toast.error("Please fill in email and password")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      if (data?.user?.identities?.length === 0) {
        toast.error("An account with this email already exists")
        setIsLoading(false)
        return
      }

      toast.success("Account created! Check your email to confirm.")
      if (data.session) {
        router.push("/dashboard")
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Get started with AI-powered financial management"
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white/70">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                type="text"
                autoCapitalize="words"
                autoComplete="name"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-[#7b39fc]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white/70">Email Address</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-[#7b39fc]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white/70">Password</Label>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-[#7b39fc]"
              />
            </div>
            <ModernButton 
              variant="primary" 
              size="md"
              className="w-full h-11 mt-2" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </ModernButton>
          </div>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0c0a14] px-2 text-white/30">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModernButton 
            variant="secondary" 
            size="md"
            className="h-11" 
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </ModernButton>
          <ModernButton 
            variant="secondary" 
            size="md"
            className="h-11" 
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </ModernButton>
        </div>
      </div>
      
      <p className="px-8 text-center text-sm text-white/40 mt-8">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-[#9055ff] hover:text-[#c084fc] font-medium underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
