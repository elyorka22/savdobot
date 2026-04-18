"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, Loader2, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { aiChatInteraction } from "@/ai/flows/ai-chat-interaction"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { translations } from "@/lib/translations"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
}

interface StoredMessage {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: string
}

const CHAT_STORAGE_KEY = "savdobot_chat_messages_v1"
const MAX_STORED_MESSAGES = 50
const CONTEXT_MESSAGES_COUNT = 6

const limitMessages = (items: Message[]) => items.slice(-MAX_STORED_MESSAGES)

const parseEventDate = (date?: string, time?: string) => {
  const now = new Date()
  const baseDate = date ? new Date(`${date}T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const [hours, minutes] = (time || "09:00").split(":").map((value) => Number(value))

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }

  baseDate.setHours(hours, minutes, 0, 0)

  // If user provided only time and it's already passed today, schedule for tomorrow.
  if (!date && baseDate.getTime() < now.getTime()) {
    baseDate.setDate(baseDate.getDate() + 1)
  }

  return baseDate
}

const isDateTimeQuestion = (text: string) => {
  const normalized = text.toLowerCase()
  const hasHourQuestion = normalized.includes("час") && (normalized.includes("котор") || normalized.includes("сколько"))
  return (
    hasHourQuestion ||
    normalized.includes("сколько времени") ||
    normalized.includes("какая дата") ||
    normalized.includes("сегодняшняя дата") ||
    normalized.includes("hozir soat nechchi") ||
    normalized.includes("soat nechchi") ||
    normalized.includes("bugun sana")
  )
}

const detectDirectReportType = (text: string): "sales" | "expenses" | "profit" | "debts" | "reminders" | "all" | null => {
  const normalized = text.toLowerCase()
  const isReportIntent =
    normalized.includes("отчет") ||
    normalized.includes("hisobot") ||
    normalized.includes("report") ||
    normalized.includes("сводк") ||
    normalized.includes("statistika") ||
    normalized.includes("статистик")

  if (!isReportIntent) {
    return null
  }

  if (normalized.includes("долг") || normalized.includes("qarz")) return "debts"
  if (normalized.includes("напомин") || normalized.includes("уведомл") || normalized.includes("eslatma") || normalized.includes("bildirish")) return "reminders"
  if (normalized.includes("расход") || normalized.includes("xarajat")) return "expenses"
  if (normalized.includes("прибыл") || normalized.includes("foyda")) return "profit"
  if (normalized.includes("продаж") || normalized.includes("sotuv")) return "sales"
  return "all"
}

export function ChatInterface() {
  const { addSale, addExpense, addDebt, addReminder, state } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru
  
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: t.chat.welcome,
      timestamp: new Date()
    }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!stored) return

    try {
      const parsed = JSON.parse(stored) as StoredMessage[]
      if (!Array.isArray(parsed) || parsed.length === 0) return

      const hydratedMessages: Message[] = parsed.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
      setMessages(limitMessages(hydratedMessages))
    } catch (error) {
      console.error("Failed to parse chat storage", error)
    }
  }, [])

  useEffect(() => {
    const serializable: StoredMessage[] = limitMessages(messages).map((message) => ({
      ...message,
      timestamp: message.timestamp.toISOString(),
    }))
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializable))
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    const nextMessages = limitMessages([...messages, userMessage])
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)

    try {
      if (isDateTimeQuestion(input)) {
        const now = new Date()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Сейчас: ${now.toLocaleString()}`,
          timestamp: now,
        }
        setMessages(prev => limitMessages([...prev, assistantMessage]))
        return
      }

      const directReportType = detectDirectReportType(input)
      if (directReportType) {
        const totalSales = state.sales.reduce((acc, s) => acc + s.amount, 0)
        const totalExpenses = state.expenses.reduce((acc, s) => acc + s.amount, 0)
        const totalProfit = totalSales - totalExpenses
        const activeDebts = state.debts.filter((item) => item.status === "active" && item.direction === "owedToUser")
        const totalDebts = activeDebts.reduce((acc, item) => acc + item.amount, 0)
        const activeReminders = state.reminders.filter((item) => item.status === "active")
        const doneReminders = state.reminders.filter((item) => item.status === "done")
        const notifiedReminders = state.reminders.filter((item) => item.notified)

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            directReportType === "sales"
              ? t.chat.reportSales.replace("{amount}", totalSales.toLocaleString())
              : directReportType === "expenses"
                ? t.chat.reportExpenses.replace("{amount}", totalExpenses.toLocaleString())
                : directReportType === "profit"
                  ? t.chat.reportProfit.replace("{amount}", totalProfit.toLocaleString())
                  : directReportType === "debts"
                    ? t.chat.reportDebts
                        .replace("{activeCount}", String(activeDebts.length))
                        .replace("{amount}", totalDebts.toLocaleString())
                    : directReportType === "reminders"
                      ? t.chat.reportReminders
                          .replace("{activeCount}", String(activeReminders.length))
                          .replace("{doneCount}", String(doneReminders.length))
                          .replace("{notifiedCount}", String(notifiedReminders.length))
                      : t.chat.reportAll
                          .replace("{sales}", totalSales.toLocaleString())
                          .replace("{expenses}", totalExpenses.toLocaleString())
                          .replace("{profit}", totalProfit.toLocaleString())
                          .replace("{debts}", totalDebts.toLocaleString())
                          .replace("{debtCount}", String(activeDebts.length))
                          .replace("{activeReminders}", String(activeReminders.length))
                          .replace("{notifiedReminders}", String(notifiedReminders.length)),
          timestamp: new Date(),
        }
        setMessages(prev => limitMessages([...prev, assistantMessage]))
        return
      }

      const recentMessages = nextMessages
        .slice(-CONTEXT_MESSAGES_COUNT)
        .map((message) => ({ role: message.role, content: message.content }))

      const response = await aiChatInteraction({
        message: input,
        currentDateTime: new Date().toISOString(),
        recentMessages,
      })
      
      let assistantResponse = ""

      if (response.action === "recordSale" && response.sale) {
        await addSale({ amount: response.sale.amount, description: response.sale.description || "AI" })
        assistantResponse = t.chat.saleRecorded.replace('{amount}', response.sale.amount.toLocaleString())
      } else if (response.action === "recordExpense" && response.expense) {
        await addExpense({ amount: response.expense.amount, description: response.expense.description })
        assistantResponse = t.chat.expenseRecorded
          .replace('{desc}', response.expense.description)
          .replace('{amount}', response.expense.amount.toLocaleString())
      } else if (response.action === "recordDebt" && response.debt) {
        await addDebt({ 
          clientName: response.debt.clientName, 
          amount: response.debt.amount, 
          direction: response.debt.direction as "owedToUser" | "owedByUser",
          description: response.debt.description || "AI",
          clientId: "unknown"
        })
        assistantResponse = t.chat.debtAdded
          .replace('{name}', response.debt.clientName)
          .replace('{amount}', response.debt.amount.toLocaleString())
      } else if (response.action === "queryFinancialData" && response.query) {
        const totalSales = state.sales.reduce((acc, s) => acc + s.amount, 0)
        const totalExpenses = state.expenses.reduce((acc, s) => acc + s.amount, 0)
        const totalProfit = totalSales - totalExpenses
        const activeDebts = state.debts.filter((item) => item.status === "active" && item.direction === "owedToUser")
        const totalDebts = activeDebts.reduce((acc, item) => acc + item.amount, 0)
        const activeReminders = state.reminders.filter((item) => item.status === "active")
        const doneReminders = state.reminders.filter((item) => item.status === "done")
        const notifiedReminders = state.reminders.filter((item) => item.notified)

        switch (response.query.dataType) {
          case "sales":
          case "earnings":
            assistantResponse = t.chat.reportSales.replace("{amount}", totalSales.toLocaleString())
            break
          case "expenses":
            assistantResponse = t.chat.reportExpenses.replace("{amount}", totalExpenses.toLocaleString())
            break
          case "profit":
            assistantResponse = t.chat.reportProfit.replace("{amount}", totalProfit.toLocaleString())
            break
          case "debts":
            assistantResponse = t.chat.reportDebts
              .replace("{activeCount}", String(activeDebts.length))
              .replace("{amount}", totalDebts.toLocaleString())
            break
          case "reminders":
            assistantResponse = t.chat.reportReminders
              .replace("{activeCount}", String(activeReminders.length))
              .replace("{doneCount}", String(doneReminders.length))
              .replace("{notifiedCount}", String(notifiedReminders.length))
            break
          case "all":
          default:
            assistantResponse = t.chat.reportAll
              .replace("{sales}", totalSales.toLocaleString())
              .replace("{expenses}", totalExpenses.toLocaleString())
              .replace("{profit}", totalProfit.toLocaleString())
              .replace("{debts}", totalDebts.toLocaleString())
              .replace("{debtCount}", String(activeDebts.length))
              .replace("{activeReminders}", String(activeReminders.length))
              .replace("{notifiedReminders}", String(notifiedReminders.length))
            break
        }
      } else if (response.action === "recordReminder" && response.reminder) {
        const eventDate = parseEventDate(response.reminder.date, response.reminder.time)

        if (!eventDate) {
          assistantResponse = t.chat.unknown
        } else {
          const remindDate = new Date(eventDate.getTime() - 5 * 60 * 1000)
          await addReminder({
            text: response.reminder.text,
            eventAt: eventDate.toISOString(),
            remindAt: remindDate.toISOString(),
          })
          assistantResponse = t.chat.reminderAdded
            .replace('{text}', response.reminder.text)
            .replace('{time}', eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        }
      } else {
        assistantResponse = response.clarification || t.chat.unknown
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date()
      }
      setMessages(prev => limitMessages([...prev, assistantMessage]))
    } catch (error) {
      console.error(error)
      setMessages(prev => limitMessages([...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: t.chat.error,
        timestamp: new Date()
      }]))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border bg-background/50 md:backdrop-blur-sm glass shadow-glow-primary">
      <ScrollArea className="flex-1 p-4 pb-24" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-end animate-fade-in",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm transition-all hover-bright",
                message.role === "assistant" 
                  ? "rounded-bl-md border border-primary/20 bg-gradient-primary text-white shadow-glow-primary" 
                  : "rounded-br-md bg-gradient-accent text-white shadow-glow-accent"
              )}>
                {message.content}
                <div className={cn(
                  "mt-1 text-[10px] opacity-70",
                  message.role === "user" ? "text-right" : "text-left"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end animate-fade-in">
              <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-gradient-primary shadow-glow-primary">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-primary/20 bg-gradient-primary px-3 py-2 text-sm shadow-glow-primary">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white/80 italic">{t.chat.thinking}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="absolute inset-x-0 bottom-0 border-t bg-background/80 md:backdrop-blur-md glass p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/50 md:backdrop-blur-sm px-2 py-1 shadow-sm hover-glow"
        >
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-accent hover-bright">
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            className="h-10 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="h-10 w-10 rounded-full bg-gradient-primary p-0 text-white shadow-glow-primary hover-bright hover:shadow-glow-accent"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
