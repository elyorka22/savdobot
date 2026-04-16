"use client"

import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Sparkles, Mic } from "lucide-react"
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

export function ChatInterface() {
  const { addSale, addExpense, addDebt, state } = useAppStore()
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

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await aiChatInteraction({ message: input })
      
      let assistantResponse = ""

      if (response.action === "recordSale" && response.sale) {
        addSale({ amount: response.sale.amount, description: response.sale.description || "AI" })
        assistantResponse = t.chat.saleRecorded.replace('{amount}', response.sale.amount.toLocaleString())
      } else if (response.action === "recordExpense" && response.expense) {
        addExpense({ amount: response.expense.amount, description: response.expense.description })
        assistantResponse = t.chat.expenseRecorded
          .replace('{desc}', response.expense.description)
          .replace('{amount}', response.expense.amount.toLocaleString())
      } else if (response.action === "recordDebt" && response.debt) {
        addDebt({ 
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
      } else {
        assistantResponse = response.clarification || t.chat.unknown
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: t.chat.error,
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden border-none bg-white/50 shadow-xl backdrop-blur-sm dark:bg-zinc-950/50">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SavdoBot AI</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-start gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm",
                message.role === "assistant" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              )}>
                {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                message.role === "assistant" 
                  ? "rounded-tl-none bg-white text-foreground dark:bg-zinc-900" 
                  : "rounded-tr-none bg-primary text-primary-foreground"
              )}>
                {message.content}
                <div className={cn(
                  "mt-1 text-[10px] opacity-50",
                  message.role === "user" ? "text-right" : "text-left"
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-primary/10 text-primary shadow-sm">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white px-4 py-3 text-sm shadow-sm dark:bg-zinc-900">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-muted-foreground italic">{t.chat.thinking}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-white p-4 dark:bg-zinc-950">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
            <Mic className="h-5 w-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat.placeholder}
            className="h-11 rounded-full border-muted-foreground/20 px-6 focus-visible:ring-primary"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="h-11 w-11 rounded-full bg-primary p-0 shadow-lg shadow-primary/20 hover:bg-primary/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
