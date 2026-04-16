"use client"

import { useAppStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { TrendingUp, Wallet, ShoppingBag, Receipt } from "lucide-react"
import { translations } from "@/lib/translations"
import { useEffect, useState } from "react"

export function FinancialSummary() {
  const { state, hydrated } = useAppStore()
  const [isClient, setIsClient] = useState(false)
  const t = translations[state.language as keyof typeof translations] || translations.ru

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!hydrated || !isClient) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex items-center gap-4 p-5 shadow-sm">
            <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const totalSales = state.sales.reduce((acc, sale) => acc + sale.amount, 0)
  const totalExpenses = state.expenses.reduce((acc, exp) => acc + exp.amount, 0)
  const totalProfit = totalSales - totalExpenses
  const totalDebt = state.clients.reduce((acc, client) => acc + client.totalDebt, 0)

  const stats = [
    { 
      label: t.dashboard.stats.totalSales, 
      value: `${totalSales.toLocaleString()} сум`, 
      icon: ShoppingBag, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      label: t.dashboard.stats.expenses, 
      value: `${totalExpenses.toLocaleString()} сум`, 
      icon: Receipt, 
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    { 
      label: t.dashboard.stats.profit, 
      value: `${totalProfit.toLocaleString()} сум`, 
      icon: Wallet, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: t.dashboard.stats.clientDebts, 
      value: `${totalDebt.toLocaleString()} сум`, 
      icon: TrendingUp, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex items-center gap-4 p-5 shadow-sm">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
