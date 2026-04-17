import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { expenseCreateSchema } from "@/lib/validations"
import { handleValidationError, createSuccessResponse, withCors, withRateLimit } from "@/lib/api-utils"

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = expenseCreateSchema.parse(body)

    const expense = await prisma.expense.create({
      data: {
        amount: validatedData.amount,
        description: validatedData.description,
      },
    })

    return createSuccessResponse({
      ...expense,
      date: expense.date.toISOString(),
    }, "Expense created successfully")
  } catch (error) {
    return handleValidationError(error)
  }
}

export const POST = withCors(withRateLimit(handler))

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count(),
    ])

    return createSuccessResponse({
      expenses: expenses.map(expense => ({
        ...expense,
        date: expense.date.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return handleValidationError(error)
  }
}
