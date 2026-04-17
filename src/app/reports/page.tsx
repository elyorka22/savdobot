"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { translations } from "@/lib/translations"

export default function ReportsPage() {
  const { state } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  // Simplified chart data
  const chartData =
    state.language === "uz"
      ? [
          { name: "Dushanba", value: 1200000 },
          { name: "Seshanba", value: 980000 },
          { name: "Chorshanba", value: 1450000 },
          { name: "Payshanba", value: 1670000 },
          { name: "Juma", value: 1890000 },
          { name: "Shanba", value: 2100000 },
          { name: "Yakshanba", value: 890000 },
        ]
      : [
          { name: "Понедельник", value: 1200000 },
          { name: "Вторник", value: 980000 },
          { name: "Среда", value: 1450000 },
          { name: "Четверг", value: 1670000 },
          { name: "Пятница", value: 1890000 },
          { name: "Суббота", value: 2100000 },
          { name: "Воскресенье", value: 890000 },
        ]

  const categoryData =
    state.language === "uz"
      ? [
          { name: "Mahsulotlar", value: 4500000, color: "#268FDF" },
          { name: "Ichimliklar", value: 3200000, color: "#10B981" },
          { name: "Kiyimlar", value: 2800000, color: "#F59E0B" },
          { name: "Boshqalar", value: 1500000, color: "#EF4444" },
        ]
      : [
          { name: "Продукты", value: 4500000, color: "#268FDF" },
          { name: "Напитки", value: 3200000, color: "#10B981" },
          { name: "Одежда", value: 2800000, color: "#F59E0B" },
          { name: "Другое", value: 1500000, color: "#EF4444" },
        ]

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t.reports.insightTitle}
            </CardTitle>
            <CardDescription>{t.reports.insightSubtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t.reports.insightText}</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t.reports.salesByDay}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-bold text-primary">{item.value.toLocaleString()} UZS</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t.reports.categories}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: item.color }}>
                      {item.value.toLocaleString()} UZS
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}