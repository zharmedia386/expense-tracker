"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Download,
  Plus,
  Calendar,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Car,
  Home,
  Utensils,
  Plane,
  Briefcase,
  Heart,
  Zap,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { ModernButton } from "./modern-button"
import { motion } from "framer-motion"
import { useScrollReveal } from "../hooks/use-scroll-reveal"

type ExpenseCategory = 
  | "Food & Dining" 
  | "Transportation" 
  | "Shopping" 
  | "Housing" 
  | "Entertainment" 
  | "Travel" 
  | "Business" 
  | "Healthcare"
  | "Utilities"

type ExpenseStatus = "Completed" | "Pending" | "Refunded"

interface Expense {
  id: string
  description: string
  category: ExpenseCategory
  amount: number
  date: string
  merchant: string
  status: ExpenseStatus
  paymentMethod: string
}

const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  "Food & Dining": Utensils,
  "Transportation": Car,
  "Shopping": ShoppingBag,
  "Housing": Home,
  "Entertainment": Zap,
  "Travel": Plane,
  "Business": Briefcase,
  "Healthcare": Heart,
  "Utilities": Zap,
}

const categoryColors: Record<ExpenseCategory, string> = {
  "Food & Dining": "bg-orange-500/20 text-orange-400",
  "Transportation": "bg-blue-500/20 text-blue-400",
  "Shopping": "bg-pink-500/20 text-pink-400",
  "Housing": "bg-emerald-500/20 text-emerald-400",
  "Entertainment": "bg-purple-500/20 text-purple-400",
  "Travel": "bg-cyan-500/20 text-cyan-400",
  "Business": "bg-slate-500/20 text-slate-400",
  "Healthcare": "bg-red-500/20 text-red-400",
  "Utilities": "bg-yellow-500/20 text-yellow-400",
}

const statusColors: Record<ExpenseStatus, string> = {
  "Completed": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Pending": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Refunded": "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

// 24 sample expenses (4 pages x 6 items)
const sampleExpenses: Expense[] = [
  // Page 1
  { id: "1", description: "Team lunch meeting", category: "Food & Dining", amount: 156.80, date: "2024-03-15", merchant: "The Capital Grille", status: "Completed", paymentMethod: "Corporate Card" },
  { id: "2", description: "Uber to airport", category: "Transportation", amount: 45.00, date: "2024-03-14", merchant: "Uber", status: "Completed", paymentMethod: "Personal Card" },
  { id: "3", description: "Office supplies", category: "Shopping", amount: 89.99, date: "2024-03-14", merchant: "Staples", status: "Completed", paymentMethod: "Corporate Card" },
  { id: "4", description: "Monthly rent", category: "Housing", amount: 2500.00, date: "2024-03-01", merchant: "Property Management", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "5", description: "Netflix subscription", category: "Entertainment", amount: 15.99, date: "2024-03-10", merchant: "Netflix", status: "Completed", paymentMethod: "Personal Card" },
  { id: "6", description: "Flight to NYC", category: "Travel", amount: 389.00, date: "2024-03-08", merchant: "Delta Airlines", status: "Pending", paymentMethod: "Corporate Card" },
  // Page 2
  { id: "7", description: "Client dinner", category: "Business", amount: 278.50, date: "2024-03-12", merchant: "Nobu", status: "Completed", paymentMethod: "Corporate Card" },
  { id: "8", description: "Pharmacy", category: "Healthcare", amount: 34.50, date: "2024-03-11", merchant: "CVS Pharmacy", status: "Completed", paymentMethod: "HSA Card" },
  { id: "9", description: "Electric bill", category: "Utilities", amount: 142.30, date: "2024-03-05", merchant: "ConEdison", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "10", description: "Grocery shopping", category: "Food & Dining", amount: 203.45, date: "2024-03-13", merchant: "Whole Foods", status: "Completed", paymentMethod: "Personal Card" },
  { id: "11", description: "Gas refill", category: "Transportation", amount: 58.00, date: "2024-03-09", merchant: "Shell", status: "Completed", paymentMethod: "Personal Card" },
  { id: "12", description: "Conference ticket", category: "Business", amount: 599.00, date: "2024-03-07", merchant: "TechConf 2024", status: "Refunded", paymentMethod: "Corporate Card" },
  // Page 3
  { id: "13", description: "New laptop bag", category: "Shopping", amount: 129.00, date: "2024-03-06", merchant: "Amazon", status: "Completed", paymentMethod: "Personal Card" },
  { id: "14", description: "Spotify Premium", category: "Entertainment", amount: 9.99, date: "2024-03-01", merchant: "Spotify", status: "Completed", paymentMethod: "Personal Card" },
  { id: "15", description: "Hotel in SF", category: "Travel", amount: 456.00, date: "2024-03-04", merchant: "Marriott", status: "Completed", paymentMethod: "Corporate Card" },
  { id: "16", description: "Dentist visit", category: "Healthcare", amount: 175.00, date: "2024-03-02", merchant: "City Dental", status: "Pending", paymentMethod: "HSA Card" },
  { id: "17", description: "Internet bill", category: "Utilities", amount: 79.99, date: "2024-03-01", merchant: "Spectrum", status: "Completed", paymentMethod: "Bank Transfer" },
  { id: "18", description: "Lunch with team", category: "Food & Dining", amount: 87.25, date: "2024-02-28", merchant: "Chipotle", status: "Completed", paymentMethod: "Corporate Card" },
  // Page 4
  { id: "19", description: "Parking garage", category: "Transportation", amount: 25.00, date: "2024-02-27", merchant: "Central Parking", status: "Completed", paymentMethod: "Personal Card" },
  { id: "20", description: "Software license", category: "Business", amount: 299.00, date: "2024-02-26", merchant: "Adobe", status: "Completed", paymentMethod: "Corporate Card" },
  { id: "21", description: "Gym membership", category: "Healthcare", amount: 49.00, date: "2024-02-25", merchant: "Equinox", status: "Completed", paymentMethod: "Personal Card" },
  { id: "22", description: "Movie tickets", category: "Entertainment", amount: 32.00, date: "2024-02-24", merchant: "AMC Theaters", status: "Completed", paymentMethod: "Personal Card" },
  { id: "23", description: "Home repairs", category: "Housing", amount: 350.00, date: "2024-02-23", merchant: "Local Handyman", status: "Pending", paymentMethod: "Personal Card" },
  { id: "24", description: "Books for work", category: "Shopping", amount: 67.50, date: "2024-02-22", merchant: "Barnes & Noble", status: "Completed", paymentMethod: "Corporate Card" },
]

const ITEMS_PER_PAGE = 6

type SortField = "date" | "amount" | "merchant" | "category"
type SortDirection = "asc" | "desc"

export function ExpenseTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "All">("All")
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | "All">("All")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal()
  const { ref: statsRef } = useScrollReveal()
  const { ref: tableRef, isVisible: tableVisible } = useScrollReveal()

  const categories: (ExpenseCategory | "All")[] = [
    "All", "Food & Dining", "Transportation", "Shopping", "Housing", 
    "Entertainment", "Travel", "Business", "Healthcare", "Utilities"
  ]

  const statuses: (ExpenseStatus | "All")[] = ["All", "Completed", "Pending", "Refunded"]

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...sampleExpenses]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        expense =>
          expense.description.toLowerCase().includes(query) ||
          expense.merchant.toLowerCase().includes(query) ||
          expense.category.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(expense => expense.category === selectedCategory)
    }

    // Filter by status
    if (selectedStatus !== "All") {
      result = result.filter(expense => expense.status === selectedStatus)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "merchant":
          comparison = a.merchant.localeCompare(b.merchant)
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [searchQuery, selectedCategory, selectedStatus, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExpenses.length / ITEMS_PER_PAGE)
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredAndSortedExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredAndSortedExpenses, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedStatus])

  const totalExpenses = filteredAndSortedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const completedExpenses = filteredAndSortedExpenses.filter(e => e.status === "Completed").reduce((sum, exp) => sum + exp.amount, 0)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedExpenses.length)

  return (
    <section className="relative bg-[#0c0a14] py-16 sm:py-20 px-4 sm:px-6 lg:px-[120px] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#7b39fc]/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[#4a2090]/8 rounded-full blur-[100px] sm:blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7b39fc]/20 to-[#9055ff]/10 border border-[#7b39fc]/30 shadow-[0_0_30px_rgba(123,57,252,0.15)] mb-4">
              <BarChart3 className="w-4 h-4 text-[#9055ff]" />
              <span className="font-[family-name:var(--font-cabin)] text-sm text-[#9055ff]">Expense Dashboard</span>
            </div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-white text-3xl sm:text-4xl lg:text-5xl text-balance">
              Every dollar,{" "}
              <em className="italic relative">
                <span className="bg-gradient-to-r from-[#9055ff] via-[#c084fc] to-[#9055ff] bg-clip-text text-transparent">
                  accounted for
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9055ff]/50 to-transparent" />
              </em>
            </h2>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-white/60 text-base sm:text-lg">
              Track, filter, and analyze all your expenses in one place
            </p>
          </div>
          <div className="flex gap-3">
            <ModernButton variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </ModernButton>
            <ModernButton variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Expense</span>
            </ModernButton>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#1a1625] to-[#13101c] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-[#7b39fc]/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#7b39fc]/20 flex items-center justify-center group-hover:bg-[#7b39fc]/30 transition-colors">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#9055ff]" />
              </div>
              <span className="font-[family-name:var(--font-cabin)] text-white/60 text-sm">Total Expenses</span>
            </div>
            <p className="font-[family-name:var(--font-inter)] text-white text-2xl sm:text-3xl font-semibold">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">12.5%</span>
              <span className="text-white/40">vs last month</span>
            </div>
          </motion.div>

          {/* Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#1a1625] to-[#13101c] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-emerald-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <span className="font-[family-name:var(--font-cabin)] text-white/60 text-sm">Completed</span>
            </div>
            <p className="font-[family-name:var(--font-inter)] text-white text-2xl sm:text-3xl font-semibold">
              ${completedExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-white/40">{filteredAndSortedExpenses.filter(e => e.status === "Completed").length} transactions</span>
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#1a1625] to-[#13101c] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-amber-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <span className="font-[family-name:var(--font-cabin)] text-white/60 text-sm">Pending</span>
            </div>
            <p className="font-[family-name:var(--font-inter)] text-white text-2xl sm:text-3xl font-semibold">
              ${filteredAndSortedExpenses.filter(e => e.status === "Pending").reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingDown className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400">{filteredAndSortedExpenses.filter(e => e.status === "Pending").length} awaiting</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 24 }}
          animate={tableVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          className="bg-gradient-to-br from-[#1a1625] to-[#13101c] rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden shadow-[0_0_60px_rgba(123,57,252,0.05)]"
        >
          <div className="p-3 sm:p-4 border-b border-white/5">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 sm:h-12 pl-10 sm:pl-12 pr-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl text-white placeholder:text-white/40 font-[family-name:var(--font-inter)] text-sm focus:outline-none focus:border-[#7b39fc]/50 focus:ring-2 focus:ring-[#7b39fc]/20 transition-all"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 h-10 sm:h-12 rounded-lg sm:rounded-xl border transition-all font-[family-name:var(--font-cabin)] text-sm ${
                  showFilters 
                    ? "bg-[#7b39fc]/20 border-[#7b39fc]/50 text-[#9055ff]" 
                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(selectedCategory !== "All" || selectedStatus !== "All") && (
                  <span className="w-2 h-2 rounded-full bg-[#7b39fc]" />
                )}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-white/40 text-xs font-[family-name:var(--font-cabin)] mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | "All")}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white font-[family-name:var(--font-inter)] text-sm focus:outline-none focus:border-[#7b39fc]/50 appearance-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#1a1625]">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex-1">
                  <label className="block text-white/40 text-xs font-[family-name:var(--font-cabin)] mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ExpenseStatus | "All")}
                    className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white font-[family-name:var(--font-inter)] text-sm focus:outline-none focus:border-[#7b39fc]/50 appearance-none cursor-pointer"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status} className="bg-[#1a1625]">{status}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== "All" || selectedStatus !== "All") && (
                  <button
                    onClick={() => {
                      setSelectedCategory("All")
                      setSelectedStatus("All")
                    }}
                    className="h-10 px-4 mt-auto text-white/60 hover:text-white text-sm font-[family-name:var(--font-cabin)] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table - Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider">
                    Description
                  </th>
                  <th 
                    className="text-left p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                    onClick={() => handleSort("merchant")}
                  >
                    <div className="flex items-center gap-1">
                      Merchant
                      <SortIcon field="merchant" />
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th 
                    className="text-right p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-white/60 transition-colors"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <SortIcon field="amount" />
                    </div>
                  </th>
                  <th className="text-center p-4 font-[family-name:var(--font-cabin)] text-white/40 text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <p className="font-[family-name:var(--font-inter)] text-white/40 text-sm">
                        No expenses found matching your criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedExpenses.map((expense, index) => {
                    const CategoryIcon = categoryIcons[expense.category]
                    return (
                      <tr 
                        key={expense.id} 
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg ${categoryColors[expense.category]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-[family-name:var(--font-manrope)] text-white font-medium text-sm">
                                {expense.description}
                              </p>
                              <p className="font-[family-name:var(--font-inter)] text-white/40 text-xs">
                                {expense.paymentMethod}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category]}`}>
                            {expense.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-[family-name:var(--font-inter)] text-white/70 text-sm">
                            {expense.merchant}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-[family-name:var(--font-inter)] text-white/50 text-sm">
                            {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-[family-name:var(--font-inter)] text-white font-semibold text-sm">
                            ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[expense.status]}`}>
                            {expense.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden p-3 space-y-3">
            {paginatedExpenses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-[family-name:var(--font-inter)] text-white/40 text-sm">
                  No expenses found
                </p>
              </div>
            ) : (
              paginatedExpenses.map((expense) => {
                const CategoryIcon = categoryIcons[expense.category]
                return (
                  <div 
                    key={expense.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#7b39fc]/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${categoryColors[expense.category]} flex items-center justify-center`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-manrope)] text-white font-medium text-sm">
                            {expense.description}
                          </p>
                          <p className="font-[family-name:var(--font-inter)] text-white/40 text-xs">
                            {expense.merchant}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[expense.status]}`}>
                        {expense.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-inter)] text-white/50 text-xs">
                        {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="font-[family-name:var(--font-inter)] text-white font-semibold">
                        ${expense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 sm:p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-inter)] text-white/40 text-xs sm:text-sm">
                Showing {startItem} to {endItem} of {filteredAndSortedExpenses.length} entries
              </p>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-[family-name:var(--font-cabin)] text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-br from-[#7b39fc] to-[#6b2fd6] text-white shadow-lg shadow-[#7b39fc]/30"
                        : "bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
