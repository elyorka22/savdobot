"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, Loader2, Sparkles, Mic } from "lucide-react"
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
        assistantResponse = t.chat.queryResult.replace('{amount}', totalSales.toLocaleString())
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
    <Card className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">SavdoBot AI</h3>
            <p className="text-xs text-emerald-600">online</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-zinc-50 p-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-end",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "max-w-[82%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                message.role === "assistant" 
                  ? "rounded-bl-md border border-zinc-200 bg-white text-zinc-900" 
                  : "rounded-br-md bg-emerald-100 text-zinc-900"
              )}>
                {message.content}
                <div className={cn(
                  "mt-1 text-[10px] text-zinc-500",
                  message.role === "user" ? "text-right" : "text-left"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end">
              <div className="mr-2 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-sky-600">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                <span className="text-zinc-500 italic">{t.chat.thinking}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-white p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2 py-1"
        >
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-zinc-400 hover:text-sky-600">
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            className="h-10 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="h-10 w-10 rounded-full bg-sky-500 p-0 hover:bg-sky-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
