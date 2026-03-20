import type { Metadata } from 'next'
import { Manrope, Cabin, Instrument_Serif, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MotionConfig } from 'framer-motion'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
});

const cabin = Cabin({ 
  subsets: ["latin"],
  variable: '--font-cabin',
});

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: '--font-instrument-serif',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ExpenseAI',
    default: 'ExpenseAI - Intelligent Financial Tracker',
  },
  description: 'Master your wealth with ExpenseAI. Track expenses, analyze spending habits, and get personalized AI optimization plans to save more money.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/assets/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/assets/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${cabin.variable} ${instrumentSerif.variable} ${inter.variable} antialiased`}>
        {/* reducedMotion="user" respects OS accessibility settings automatically */}
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
