"use client"

import { AppShell } from "@/components/layout/app-shell"
import { ChatInterface } from "@/components/chat/chat-interface"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Добро пожаловать в SavdoBot</h2>
              <p className="text-muted-foreground">Твой бизнес под полным контролем ассистента.</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                <Sparkles className="h-4 w-4" />
                <span>AI Мониторинг активен</span>
              </div>
            </div>
          </div>
          <FinancialSummary />
        </section>

        <section>
          <ChatInterface />
        </section>
      </div>
    </AppShell>
  )
}