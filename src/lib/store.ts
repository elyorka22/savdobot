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

export interface AppState {
  sales: Sale[]
  expenses: Expense[]
  clients: Client[]
  debts: Debt[]
  language: "ru" | "uz" | "en"
}

const STORAGE_KEY = "savdobot_v1_storage"

const initialData: AppState = {
  sales: [
    { id: "1", amount: 150000, description: "Продукты питания", date: new Date().toISOString() },
    { id: "2", amount: 75000, description: "Напитки", date: new Date(Date.now() - 86400000).toISOString() }
  ],
  expenses: [
    { id: "1", amount: 45000, description: "Аренда", date: new Date().toISOString() }
  ],
  clients: [
    { id: "1", name: "Азиз", totalDebt: 100000 }
  ],
  debts: [
    { 
      id: "1", 
      clientId: "1", 
      clientName: "Азиз", 
      amount: 100000, 
      direction: "owedToUser", 
      description: "Остаток за прошлый месяц", 
      date: new Date().toISOString(),
      status: "active"
    }
  ],
  language: "ru"
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(initialData)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setState(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse storage", e)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, hydrated])

  const addSale = (sale: Omit<Sale, "id" | "date">) => {
    const newSale: Sale = {
      ...sale,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    }
    setState(prev => ({ ...prev, sales: [newSale, ...prev.sales] }))
  }

  const addExpense = (expense: Omit<Expense, "id" | "date">) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    }
    setState(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }))
  }

  const addDebt = (debt: Omit<Debt, "id" | "date" | "status">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newDebt: Debt = {
      ...debt,
      id,
      date: new Date().toISOString(),
      status: "active"
    }
    
    setState(prev => {
      // Find or create client
      let clients = [...prev.clients]
      const clientIndex = clients.findIndex(c => c.name.toLowerCase() === debt.clientName.toLowerCase())
      
      if (clientIndex === -1) {
        clients.push({
          id: Math.random().toString(36).substr(2, 9),
          name: debt.clientName,
          totalDebt: debt.direction === "owedToUser" ? debt.amount : -debt.amount
        })
      } else {
        const adjustment = debt.direction === "owedToUser" ? debt.amount : -debt.amount
        clients[clientIndex] = {
          ...clients[clientIndex],
          totalDebt: clients[clientIndex].totalDebt + adjustment
        }
      }

      return {
        ...prev,
        clients,
        debts: [newDebt, ...prev.debts]
      }
    })
  }

  const markDebtAsPaid = (debtId: string) => {
    setState(prev => {
      const debt = prev.debts.find(d => d.id === debtId)
      if (!debt || debt.status === "paid") return prev

      const adjustment = debt.direction === "owedToUser" ? -debt.amount : debt.amount
      
      const updatedClients = prev.clients.map(c => 
        c.name === debt.clientName ? { ...c, totalDebt: c.totalDebt + adjustment } : c
      )

      const updatedDebts = prev.debts.map(d => 
        d.id === debtId ? { ...d, status: "paid" as const } : d
      )

      return {
        ...prev,
        clients: updatedClients,
        debts: updatedDebts
      }
    })
  }

  const setLanguage = (language: AppState["language"]) => {
    setState(prev => ({ ...prev, language }))
  }

  return {
    state,
    addSale,
    addExpense,
    addDebt,
    markDebtAsPaid,
    setLanguage,
    hydrated
  }
}