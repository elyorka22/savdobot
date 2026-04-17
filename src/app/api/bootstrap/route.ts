import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [sales, expenses, clients, debts, reminders] = await Promise.all([
      prisma.sale.findMany({ orderBy: { date: "desc" } }),
      prisma.expense.findMany({ orderBy: { date: "desc" } }),
      prisma.client.findMany({ orderBy: { name: "asc" } }),
      prisma.debt.findMany({ orderBy: { date: "desc" } }),
      prisma.reminder.findMany({ orderBy: { createdAt: "desc" } }),
    ])

    return NextResponse.json({
      sales: sales.map((item) => ({ ...item, date: item.date.toISOString() })),
      expenses: expenses.map((item) => ({ ...item, date: item.date.toISOString() })),
      clients,
      debts: debts.map((item) => ({
        ...item,
        direction: item.direction as "owedToUser" | "owedByUser",
        status: item.status as "active" | "paid",
        date: item.date.toISOString(),
        dueDate: item.dueDate ? item.dueDate.toISOString() : undefined,
      })),
      reminders: reminders.map((item) => ({
        ...item,
        status: item.status as "active" | "done",
        eventAt: item.eventAt.toISOString(),
        remindAt: item.remindAt.toISOString(),
        createdAt: item.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Failed to load bootstrap data, using fallback", error)
    return NextResponse.json({
      sales: [],
      expenses: [],
      clients: [],
      debts: [],
      reminders: [],
    })
  }
}
