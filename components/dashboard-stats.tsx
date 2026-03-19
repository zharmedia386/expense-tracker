"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: LucideIcon
  index: number
}

export function StatCard({ title, value, change, trend, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-[#7b39fc]/30 transition-all group relative overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#7b39fc]/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#7b39fc]/10 transition-all" />

      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-[#7b39fc]/10 flex items-center justify-center border border-[#7b39fc]/20 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-[#9055ff]" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          trend === "up" ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
        }`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>

      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>

      {/* Mini sparkline placeholder */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-end gap-1 h-8">
        {[20, 40, 30, 50, 70, 40, 60, 45, 55].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
            className={`flex-1 rounded-t-sm ${trend === "up" ? "bg-emerald-400/20" : "bg-rose-400/20"}`}
          />
        ))}
      </div>
    </motion.div>
  )
}
