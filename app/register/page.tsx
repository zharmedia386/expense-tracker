"use client"

import * as React from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Github } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = React.useState(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    // Simulate register delay
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
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
                placeholder="••••••••"
                type="password"
                autoComplete="new-password"
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-11 focus-visible:ring-[#7b39fc]"
              />
            </div>
            <Button 
              className="bg-[#7b39fc] hover:bg-[#6a2ee0] text-white h-11 mt-2 rounded-xl transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
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
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button 
            variant="outline" 
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-11 rounded-xl transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
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
