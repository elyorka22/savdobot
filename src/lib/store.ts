"use client"

import { useState, useEffect } from "react"

export interface Sale {
  id: string
  amount: number
  description: string
  date: string
}

export interface Expense {
  id: string
  amount: number
  description: string
  date: string
}

export interface Client {
  id: string
  name: string
  phone?: string
  totalDebt: number
}

export interface Debt {
  id: string
  clientId: string
  clientName: string
  amount: number
  direction: "owedToUser" | "owedByUser"
  description: string
  dueDate?: string
  date: string
  status: "active" | "paid"
}

export interface Reminder {
  id: string
  text: string
  eventAt: string
  remindAt: string
  notified: boolean
  status: "active" | "done"
  createdAt: string
}

export interface AppState {
  sales: Sale[]
  expenses: Expense[]
  clients: Client[]
  debts: Debt[]
  reminders: Reminder[]
  language: "ru" | "uz" | "en"
}

const LANGUAGE_STORAGE_KEY = "savdobot_language_v1"

const initialData: AppState = {
  sales: [],
  expenses: [],
  clients: [],
  debts: [],
  reminders: [],
  language: "ru"
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialData)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const languageFromStorage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppState["language"] | null
        const response = await fetch("/api/bootstrap", { cache: "no-store" })
        if (!response.ok) {
          throw new Error("Failed to load bootstrap data")
        }

        const payload = await response.json()
        setState({
          sales: payload.sales ?? [],
          expenses: payload.expenses ?? [],
          clients: payload.clients ?? [],
          debts: payload.debts ?? [],
          reminders: payload.reminders ?? [],
          language: languageFromStorage ?? "ru",
        })
      } catch (e) {
        console.error("Failed to load app data", e)
        setState((prev) => ({ ...prev, language: prev.language || "ru" }))
      } finally {
        setHydrated(true)
      }
    }

    loadData()
  }, [])

  const addSale = async (sale: Omit<Sale, "id" | "date">) => {
    const response = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sale),
    })
    if (!response.ok) return
    const createdSale = (await response.json()) as Sale
    setState(prev => ({ ...prev, sales: [createdSale, ...prev.sales] }))
  }

  const addExpense = async (expense: Omit<Expense, "id" | "date">) => {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    })
    if (!response.ok) return
    const createdExpense = (await response.json()) as Expense
    setState(prev => ({ ...prev, expenses: [createdExpense, ...prev.expenses] }))
  }

  const addDebt = async (debt: Omit<Debt, "id" | "date" | "status">) => {
    const response = await fetch("/api/debts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debt),
    })
    if (!response.ok) return

    const payload = await response.json() as { debt: Debt; client: Client }
    setState(prev => {
      const nextClients = prev.clients.some((item) => item.id === payload.client.id)
        ? prev.clients.map((item) => (item.id === payload.client.id ? payload.client : item))
        : [payload.client, ...prev.clients]

      return {
        ...prev,
        clients: nextClients,
        debts: [payload.debt, ...prev.debts],
      }
    })
  }

  const markDebtAsPaid = async (debtId: string) => {
    const response = await fetch(`/api/debts/${debtId}/pay`, { method: "PATCH" })
    if (!response.ok) return

    const payload = await response.json() as { debt: Debt; client: Client }
    setState(prev => ({
      ...prev,
      clients: prev.clients.map((item) => (item.id === payload.client.id ? payload.client : item)),
      debts: prev.debts.map((item) => (item.id === payload.debt.id ? payload.debt : item)),
    }))
  }

  const addReminder = async (reminder: Omit<Reminder, "id" | "createdAt" | "notified" | "status">) => {
    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminder),
    })
    if (!response.ok) return
    const createdReminder = (await response.json()) as Reminder
    setState(prev => ({ ...prev, reminders: [createdReminder, ...prev.reminders] }))
  }

  const markReminderNotified = async (reminderId: string) => {
    const response = await fetch(`/api/reminders/${reminderId}/notified`, { method: "PATCH" })
    if (!response.ok) return
    const updatedReminder = (await response.json()) as Reminder
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map((item) => (item.id === updatedReminder.id ? updatedReminder : item)),
    }))
  }

  const markReminderDone = async (reminderId: string) => {
    const response = await fetch(`/api/reminders/${reminderId}/done`, { method: "PATCH" })
    if (!response.ok) return
    const updatedReminder = (await response.json()) as Reminder
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map((item) => (item.id === updatedReminder.id ? updatedReminder : item)),
    }))
  }

  const setLanguage = (language: AppState["language"]) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    setState(prev => ({ ...prev, language }))
  }

  return {
    state,
    addSale,
    addExpense,
    addDebt,
    markDebtAsPaid,
    addReminder,
    markReminderNotified,
    markReminderDone,
    setLanguage,
    hydrated
  }
}