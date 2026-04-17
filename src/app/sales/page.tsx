"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { translations } from "@/lib/translations"

export default function SalesPage() {
  const { state, hydrated } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.sales.title}</h2>
            <p className="text-muted-foreground">{t.sales.subtitle}</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t.sales.addBtn}
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder={t.sales.searchPlaceholder} />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">{t.sales.history}</CardTitle>
            <Badge variant="outline" className="font-normal">{t.sales.total}: {state.sales.length}</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.sales.date}</TableHead>
                  <TableHead>{t.sales.description}</TableHead>
                  <TableHead className="text-right">{t.sales.amount}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hydrated && state.sales.length > 0 ? (
                  state.sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="text-muted-foreground">
                        {new Date(sale.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{sale.description}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">
                        {sale.amount.toLocaleString()} сум
                      </TableCell>
                    </TableRow>
                  ))
                ) : !hydrated ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      {t.sales.loading}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      {t.sales.empty}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
