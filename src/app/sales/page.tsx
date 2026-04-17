"use client"

import { AppShell } from "@/components/layout/app-shell"
import { ModernHeader } from "@/components/layout/modern-header"
import { ModernStatsCard, ModernStatsGrid } from "@/components/ui/modern-stats-card"
import { ModernTable } from "@/components/ui/modern-table"
import { useAppStore } from "@/lib/store"
import { Plus, TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { translations } from "@/lib/translations"

export default function SalesPage() {
  const { state, hydrated, addSale } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  // Calculate statistics
  const totalSales = state.sales.reduce((sum, sale) => sum + sale.amount, 0)
  const averageSale = state.sales.length > 0 ? totalSales / state.sales.length : 0
  const todaySales = state.sales.filter(sale => {
    const saleDate = new Date(sale.date).toDateString()
    const today = new Date().toDateString()
    return saleDate === today
  }).reduce((sum, sale) => sum + sale.amount, 0)

  // Table columns
  const columns = [
    {
      key: "date" as const,
      title: t.sales.date,
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: "description" as const,
      title: t.sales.description,
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{value}</p>
        </div>
      )
    },
    {
      key: "amount" as const,
      title: t.sales.amount,
      sortable: true,
      searchable: false,
      render: (value: number) => (
        <div className="text-right">
          <p className="font-bold text-success">
            {value.toLocaleString()} {t.sales.currency}
          </p>
        </div>
      ),
      className: "text-right"
    }
  ]

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        {/* Modern Header */}
        <ModernHeader
          title={t.sales.title}
          subtitle={t.sales.subtitle}
          actions={
            <Button className="bg-gradient-primary shadow-glow-primary hover-bright">
              <Plus className="h-4 w-4 mr-2" />
              {t.sales.addBtn}
            </Button>
          }
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Stats Cards */}
            <ModernStatsGrid>
              <ModernStatsCard
                title="Total Revenue"
                value={`${totalSales.toLocaleString()} ${t.sales.currency}`}
                change={{
                  value: 12.5,
                  type: "increase",
                  period: "vs last month"
                }}
                icon={DollarSign}
                description="All time sales"
                gradient="primary"
              />
              
              <ModernStatsCard
                title="Average Sale"
                value={`${averageSale.toLocaleString()} ${t.sales.currency}`}
                change={{
                  value: 8.2,
                  type: "increase",
                  period: "vs last month"
                }}
                icon={BarChart3}
                description="Per transaction"
                gradient="secondary"
              />
              
              <ModernStatsCard
                title="Today's Sales"
                value={`${todaySales.toLocaleString()} ${t.sales.currency}`}
                change={{
                  value: 5.1,
                  type: "increase",
                  period: "vs yesterday"
                }}
                icon={TrendingUp}
                description="Today only"
                gradient="success"
              />
              
              <ModernStatsCard
                title="Total Transactions"
                value={state.sales.length}
                change={{
                  value: 15.3,
                  type: "increase",
                  period: "vs last month"
                }}
                icon={Calendar}
                description="All sales"
                gradient="accent"
              />
            </ModernStatsGrid>

            {/* Sales Table */}
            <ModernTable
              data={state.sales}
              columns={columns}
              title={t.sales.history}
              subtitle={`${state.sales.length} total transactions`}
              searchable={true}
              selectable={true}
              actions={{
                view: (sale) => console.log("View sale:", sale),
                edit: (sale) => console.log("Edit sale:", sale),
                delete: (sale) => console.log("Delete sale:", sale)
              }}
              loading={!hydrated}
              emptyState={
                <div className="text-center py-12">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No sales yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding your first sales to see them here
                  </p>
                  <Button className="bg-gradient-primary shadow-glow-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Sale
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
