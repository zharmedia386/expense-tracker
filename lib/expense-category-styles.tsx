import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Plane,
  Briefcase,
  Heart,
  type LucideIcon,
} from "lucide-react"
import type { ExpenseCategory } from "./expenses/types"

export const categoryIcons: Record<ExpenseCategory, LucideIcon> = {
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

export const categoryColors: Record<ExpenseCategory, string> = {
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

export function getCategoryStyle(category: string): { icon: LucideIcon; colorClass: string } {
  const cat = (category || "Other") as ExpenseCategory
  return {
    icon: categoryIcons[cat] ?? Zap,
    colorClass: categoryColors[cat] ?? "bg-white/10 text-white/70",
  }
}
