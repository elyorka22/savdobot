import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { amount?: number; description?: string }
    if (!body.amount || !body.description) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const expense = await prisma.expense.create({
      data: {
        amount: body.amount,
        description: body.description,
      },
    })

    return NextResponse.json({
      ...expense,
      date: expense.date.toISOString(),
    })
  } catch (error) {
    console.error("Failed to create expense", error)
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 })
  }
}
