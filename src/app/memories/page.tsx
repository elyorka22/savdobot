"use client"

import { AppShell } from "@/components/layout/app-shell"
import { useAppStore } from "@/lib/store"
import { translations } from "@/lib/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function MemoriesPage() {
  const { state, hydrated, markReminderDone } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t.reminders.title}</h2>
          <p className="text-muted-foreground">{t.reminders.subtitle}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.reminders.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hydrated ? (
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            ) : state.reminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.reminders.empty}</p>
            ) : (
              state.reminders.map((item) => (
                <div key={item.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{item.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.reminders.eventTime}: {new Date(item.eventAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.reminders.remindTime}: {new Date(item.remindAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={item.status === "done" ? "secondary" : "default"}>
                      {item.status === "done" ? t.reminders.done : t.reminders.active}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.notified ? t.reminders.notified : t.reminders.pending}
                    </span>
                    {item.status !== "done" && (
                      <Button size="sm" variant="outline" onClick={() => void markReminderDone(item.id)}>
                        {t.reminders.doneBtn}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
