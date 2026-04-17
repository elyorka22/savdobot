"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserPlus, Phone, CreditCard, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { translations } from "@/lib/translations"

export default function ClientsPage() {
  const { state, hydrated } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.clients.title}</h2>
            <p className="text-muted-foreground">{t.clients.subtitle}</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            {t.clients.addBtn}
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder={t.clients.searchPlaceholder} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hydrated && state.clients.length > 0 ? (
            state.clients.map((client) => (
              <Card key={client.id} className="group overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {client.phone || t.clients.phone}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      {t.clients.debt}
                    </div>
                    <span className={cn(
                      "font-bold",
                      client.totalDebt > 0 ? "text-amber-600" : "text-emerald-600"
                    )}>
                      {client.totalDebt.toLocaleString()} сум
                    </span>
                  </div>
                  <Button variant="outline" className="w-full text-xs font-medium">{t.clients.viewHistory}</Button>
                </CardContent>
              </Card>
            ))
          ) : !hydrated ? (
            <div className="col-span-full flex h-48 items-center justify-center text-muted-foreground">
              {t.clients.loading}
            </div>
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              {t.clients.empty}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
