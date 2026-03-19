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
import { useAnalytics } from "@/hooks/use-analytics"
import { formatIDR } from "@/lib/currency"

const placeholderWeekly = [
  { name: "Mon", amount: 0 },
  { name: "Tue", amount: 0 },
  { name: "Wed", amount: 0 },
  { name: "Thu", amount: 0 },
  { name: "Fri", amount: 0 },
  { name: "Sat", amount: 0 },
  { name: "Sun", amount: 0 },
]

const placeholderCategory = [
  { name: "No data", value: 1, color: "#7b39fc" },
]

export function ExpenseCharts() {
  const [months, setMonths] = React.useState(6)
  const { data } = useAnalytics(months)
  const weeklyData = data?.weeklySpending?.map(({ day, amount }) => ({ name: day, amount })) ?? placeholderWeekly
  const categoryData = data?.categoryData?.length ? data.categoryData : placeholderCategory
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
            <p className="text-white/40 text-sm">Spending by day of week</p>
          </div>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#7b39fc]"
          >
            <option value={1}>Last 1 Month</option>
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                formatter={(value: number) => [formatIDR(value), "Amount"]}
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
                 formatter={(value: number) => [formatIDR(value), "Amount"]}
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
              <span className="text-white font-medium">{formatIDR(item.value)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
