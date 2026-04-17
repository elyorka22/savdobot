import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { createSuccessResponse, handleValidationError, withCors, withRateLimit } from "@/lib/api-utils"

async function handler(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    logger.database("query", "bootstrap", undefined, { operation: "load_all_data" })

    const [sales, expenses, clients, debts, reminders] = await Promise.all([
      prisma.sale.findMany({ orderBy: { date: "desc" } }),
      prisma.expense.findMany({ orderBy: { date: "desc" } }),
      prisma.client.findMany({ orderBy: { name: "asc" } }),
      prisma.debt.findMany({ orderBy: { date: "desc" } }),
      prisma.reminder.findMany({ orderBy: { createdAt: "desc" } }),
    ])

    const duration = Date.now() - startTime
    logger.api("GET", "/api/bootstrap", 200, duration, { 
      recordsCount: {
        sales: sales.length,
        expenses: expenses.length,
        clients: clients.length,
        debts: debts.length,
        reminders: reminders.length,
      }
    })

    return createSuccessResponse({
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
    }, "Bootstrap data loaded successfully")
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error("Failed to load bootstrap data", { 
      error: error instanceof Error ? error.message : String(error),
      duration,
    })
    
    return createSuccessResponse({
      sales: [],
      expenses: [],
      clients: [],
      debts: [],
      reminders: [],
    }, "Fallback data loaded")
  }
}

export const GET = withCors(withRateLimit(handler))
