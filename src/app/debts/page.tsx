"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Plus, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { translations } from "@/lib/translations"

export default function DebtsPage() {
  const { state, markDebtAsPaid, hydrated } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  const activeDebtTotal = state.debts
    .filter((d) => d.status === "active" && d.direction === "owedToUser")
    .reduce((acc, d) => acc + d.amount, 0)

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.debts.title}</h2>
            <p className="text-muted-foreground">{t.debts.subtitle}</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            {t.debts.addBtn}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-emerald-600 uppercase">{t.debts.collectedToday}</p>
              <p className="text-2xl font-bold text-emerald-700">0 сум</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-amber-600 uppercase">{t.debts.expected}</p>
              <p className="text-2xl font-bold text-amber-700">
                {hydrated ? activeDebtTotal.toLocaleString() : "..."} сум
              </p>
            </CardContent>
          </Card>
          <Card className="bg-rose-50 dark:bg-rose-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-rose-600 uppercase">{t.debts.overdue}</p>
              <p className="text-2xl font-bold text-rose-700">0 сум</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">{t.debts.activeDebts}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.debts.client}</TableHead>
                  <TableHead>{t.debts.description}</TableHead>
                  <TableHead>{t.debts.status}</TableHead>
                  <TableHead className="text-right">{t.debts.amount}</TableHead>
                  <TableHead className="text-right">{t.debts.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hydrated && state.debts.length > 0 ? (
                  state.debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-semibold">{debt.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{debt.description}</TableCell>
                      <TableCell>
                        {debt.status === "active" ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">{t.debts.active}</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{t.debts.paid}</Badge>
                        )}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${debt.direction === 'owedToUser' ? 'text-amber-600' : 'text-rose-600'}`}>
                        {debt.direction === 'owedByUser' ? '-' : ''}{debt.amount.toLocaleString()} сум
                      </TableCell>
                      <TableCell className="text-right">
                        {debt.status === "active" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => void markDebtAsPaid(debt.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t.debts.payBtn}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : !hydrated ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      {t.debts.loading}
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      {t.debts.empty}
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
