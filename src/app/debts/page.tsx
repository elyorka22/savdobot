"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { CreditCard, Plus, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DebtsPage() {
  const { state, markDebtAsPaid } = useAppStore()

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Долговая книга</h2>
            <p className="text-muted-foreground">Управляйте долгами ваших клиентов в одном месте.</p>
          </div>
          <Button className="gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            Записать долг
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-emerald-600 uppercase">Собрано сегодня</p>
              <p className="text-2xl font-bold text-emerald-700">0 сум</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-amber-600 uppercase">Ожидается выплат</p>
              <p className="text-2xl font-bold text-amber-700">
                {state.debts.filter(d => d.status === "active").reduce((acc, d) => acc + d.amount, 0).toLocaleString()} сум
              </p>
            </CardContent>
          </Card>
          <Card className="bg-rose-50 dark:bg-rose-950/20">
            <CardContent className="pt-6">
              <p className="text-xs font-medium text-rose-600 uppercase">Просрочено</p>
              <p className="text-2xl font-bold text-rose-700">0 сум</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Активные долги</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead className="text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.debts.length > 0 ? (
                  state.debts.map((debt) => (
                    <TableRow key={debt.id}>
                      <TableCell className="font-semibold">{debt.clientName}</TableCell>
                      <TableCell className="text-muted-foreground">{debt.description}</TableCell>
                      <TableCell>
                        {debt.status === "active" ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Активен</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Оплачен</Badge>
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
                            onClick={() => markDebtAsPaid(debt.id)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Оплатить
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Долгов не найдено.
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