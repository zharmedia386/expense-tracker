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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAnalytics } from "@/hooks/use-analytics"
import { formatIDR } from "@/lib/currency"
import { ModernSelect } from "@/components/modern-select"

const placeholderMonthly = [
  { name: "Jan", spending: 0 },
  { name: "Feb", spending: 0 },
  { name: "Mar", spending: 0 },
  { name: "Apr", spending: 0 },
  { name: "May", spending: 0 },
  { name: "Jun", spending: 0 },
]

const placeholderCategory = [
  { name: "No data", value: 1, color: "#7b39fc" },
]

const TIMEFRAME_OPTIONS = [
  { label: "Last 30 Days", value: "30" },
  { label: "Last 3 Months", value: "90" },
  { label: "Last 6 Months", value: "180" },
  { label: "Last Year", value: "365" },
]

export function ExpenseCharts() {
  const [timeframe, setTimeframe] = React.useState("180")
  const { data } = useAnalytics(Number(timeframe))
  const monthlyData = data?.monthlyData?.length ? data.monthlyData : placeholderMonthly
  const categoryData = data?.categoryData?.length ? data.categoryData : placeholderCategory

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Spending Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-2 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Spending Analytics</h3>
            <p className="text-white/40 text-sm">Monthly spending by category</p>
          </div>
          <div className="w-40">
            <ModernSelect
              value={timeframe}
              onValueChange={setTimeframe}
              options={TIMEFRAME_OPTIONS}
              placeholder="Select timeframe"
            />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorSpendingOverview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b39fc" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7b39fc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.2)"
                fontSize={10}
                fontWeight="bold"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp ${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c0a14",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                }}
                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                formatter={(value: number) => [formatIDR(value), "Spending"]}
              />
              <Area
                type="monotone"
                dataKey="spending"
                stroke="#7b39fc"
                fillOpacity={1}
                fill="url(#colorSpendingOverview)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* By Category - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="lg:col-span-1 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-8 tracking-tight">By Category</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c0a14",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                }}
                itemStyle={{ color: "#fff", fontWeight: "bold" }}
                formatter={(value: number) => [formatIDR(value), "Amount"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 space-y-4">
          {categoryData.slice(0, 4).map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-white/50 font-medium">{cat.name}</span>
              </div>
              <span className="text-sm font-bold text-white tabular-nums">{formatIDR(cat.value)}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
