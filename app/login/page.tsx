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

export default function LoginPage() {
  const router = useRouter()
  const [redirectTo, setRedirectTo] = React.useState("/dashboard")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectTo(params.get("redirect") || "/dashboard")
  }, [])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      toast.error("Please fill in email and password")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      toast.success("Signed in successfully!")
      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your account"
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/70">Password</Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-[#9055ff] hover:text-[#c084fc] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
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
              {isLoading ? "Signing in..." : "Sign In"}
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
        Don't have an account?{" "}
        <Link 
          href="/register" 
          className="text-[#9055ff] hover:text-[#c084fc] font-medium underline underline-offset-4 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
