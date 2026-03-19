"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts"

const data = [
  { name: "Mon", amount: 2400 },
  { name: "Tue", amount: 1398 },
  { name: "Wed", amount: 9800 },
  { name: "Thu", amount: 3908 },
  { name: "Fri", amount: 4800 },
  { name: "Sat", amount: 3800 },
  { name: "Sun", amount: 4300 },
]

const categoryData = [
  { name: "Food", value: 400, color: "#7b39fc" },
  { name: "Transport", value: 300, color: "#9055ff" },
  { name: "SaaS", value: 300, color: "#c084fc" },
  { name: "Entertainment", value: 200, color: "#d8b4fe" },
]

export function ExpenseCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart - Main Spending Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-2 p-8 rounded-[32px] bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Spending Analytics</h3>
            <p className="text-white/40 text-sm">Your cash flow for the last 7 days</p>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#7b39fc]">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b39fc" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7b39fc" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#ffffff40", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#ffffff40", fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1c1926", 
                  borderColor: "#ffffff10", 
                  borderRadius: "12px",
                  color: "#fff"
                }} 
                itemStyle={{ color: "#9055ff" }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#7b39fc" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bar Chart - Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col"
      >
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white">Categories</h3>
          <p className="text-white/40 text-sm">Top spending sectors</p>
        </div>

        <div className="flex-1 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: -20 }}>
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#ffffff70", fontSize: 11 }}
              />
              <Tooltip 
                 cursor={{ fill: 'transparent' }}
                 contentStyle={{ 
                  backgroundColor: "#1c1926", 
                  borderColor: "#ffffff10", 
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-3">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/60">{item.name}</span>
              </div>
              <span className="text-white font-medium">${item.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
