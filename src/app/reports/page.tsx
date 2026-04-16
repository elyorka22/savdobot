"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts"
import { Sparkles, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function ReportsPage() {
  const { state } = useAppStore()

  // Simplified chart data
  const chartData = [
    { name: "Пн", value: 120000 },
    { name: "Вт", value: 95000 },
    { name: "Ср", value: 150000 },
    { name: "Чт", value: 80000 },
    { name: "Пт", value: 210000 },
    { name: "Сб", value: 250000 },
    { name: "Вс", value: 180000 },
  ]

  const categoryData = [
    { name: "Продукты", value: 450000, color: "#268FDF" },
    { name: "Хозтовары", value: 220000, color: "#6354DB" },
    { name: "Напитки", value: 180000, color: "#10B981" },
  ]

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Аналитика</h2>
            <p className="text-muted-foreground">Визуальные отчеты о росте вашего бизнеса.</p>
          </div>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">AI-Инсайт недели</CardTitle>
              <CardDescription className="text-primary/70">Анализ подготовлен SavdoBot</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 leading-relaxed">
              Ваши продажи в пятницу и субботу выросли на 25% по сравнению с прошлым периодом. 
              Наиболее популярная категория — <strong>"Продукты"</strong>. 
              Рекомендуем пополнить запасы к следующему уикенду.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Продажи по дням</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                    <YAxis axisLine={false} tickLine={false} hide />
                    <Tooltip 
                      cursor={{ fill: 'rgba(38, 143, 223, 0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#268FDF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Категории доходов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}