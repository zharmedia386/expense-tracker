"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { motion } from "framer-motion"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Target,
  Zap,
  Calendar
} from "lucide-react"
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

const TIMEFRAME_OPTIONS = [
  { label: "Last 30 Days", value: "30" },
  { label: "Last 3 Months", value: "90" },
  { label: "Last 6 Months", value: "180" },
  { label: "Last Year", value: "365" },
]

const placeholderCategory = [
  { name: "No data", value: 1, color: "#7b39fc" },
]

const placeholderWeekly = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 0 },
  { day: "Fri", amount: 0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = React.useState("180")
  const { data, loading, error } = useAnalytics(6) // Fixed for now, but timeframe could be used

  const monthlyData = data?.monthlyData?.length ? data.monthlyData : placeholderMonthly
  const categoryData = data?.categoryData?.length ? data.categoryData : placeholderCategory
  const weeklySpending = data?.weeklySpending ?? placeholderWeekly
  const spendingPeak = data?.spendingPeak ?? { amount: 0, day: "—" }

  return (
    <DashboardLayout>
      {(error || loading) && (
        <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${error ? "bg-amber-500/10 text-amber-400" : "text-white/40"}`}>
          {loading ? (
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Loading analytics...
             </div>
          ) : error}
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-white/40 mt-1 text-sm">Deep dive into your spending habits and financial trends</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-48"
        >
          <ModernSelect
            value={timeframe}
            onValueChange={setTimeframe}
            options={TIMEFRAME_OPTIONS}
            placeholder="Select timeframe"
          />
        </motion.div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Spending Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white tracking-tight">Monthly Spending</h3>
            <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#7b39fc] shadow-[0_0_10px_rgba(123,57,252,0.5)]" />
                <span className="text-white/40">Spending</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b39fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7b39fc" stopOpacity={0}/>
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
                  tickFormatter={(value) => `Rp ${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0c0a14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
                  itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  formatter={(value: number) => [formatIDR(value), "Spending"]}
                />
                <Area type="monotone" dataKey="spending" stroke="#7b39fc" fillOpacity={1} fill="url(#colorSpending)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                  contentStyle={{ backgroundColor: "#0c0a14", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
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

        {/* Weekly Spending Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1 p-8 rounded-[32px] bg-white/5 border border-white/10 flex flex-col backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-6 text-[#9055ff]">
            <Zap className="w-5 h-5 fill-current shadow-[0_0_15px_rgba(144,85,255,0.5)]" />
            <h3 className="text-lg font-bold text-white tracking-tight">Spending Peak</h3>
          </div>
          <p className="text-3xl font-bold text-white mb-2 tabular-nums">{formatIDR(spendingPeak.amount)}</p>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">Highest day: <span className="text-white">{spendingPeak.day}</span></p>
          
          <div className="mt-auto h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpending}>
                <Bar 
                  dataKey="amount" 
                  fill="#7b39fc" 
                  radius={[6, 6, 6, 6]} 
                  opacity={0.3}
                  className="cursor-pointer hover:opacity-100 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-[#7b39fc]/20 via-transparent to-transparent border border-[#7b39fc]/30 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#7b39fc] flex items-center justify-center shadow-[0_8px_20px_rgba(123,57,252,0.4)] group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Savings Potential</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-8 text-base">
                Based on your last 3 months, you could save up to <span className="text-[#9055ff] font-bold">{formatIDR(420000)}/month</span> by optimizing your "Entertainment" subscriptions and switching to a weekly grocery plan.
              </p>
              <button className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all cursor-pointer">
                View AI Optimization Plan
                <ArrowRight className="w-5 h-5 text-[#9055ff]" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                <TrendingUp className="w-5 h-5 text-emerald-400 mb-3" />
                <p className="text-2xl font-bold text-white">+14%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Net Growth</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
                <TrendingDown className="w-5 h-5 text-amber-400 mb-3" />
                <p className="text-2xl font-bold text-white">-8%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">Cost Reduction</p>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Glow */}
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#7b39fc]/30 blur-[100px] rounded-full group-hover:bg-[#7b39fc]/40 transition-colors duration-700" />
        </motion.div>

      </div>
    </DashboardLayout>
  )
}
