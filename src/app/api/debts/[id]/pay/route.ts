import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await prisma.$transaction(async (tx) => {
      const debt = await tx.debt.findUnique({ where: { id } })
      if (!debt) return null

      const client = await tx.client.findUnique({ where: { id: debt.clientId } })
      if (!client) return null

      if (debt.status === "paid") {
        return { debt, client }
      }

      const adjustment = debt.direction === "owedToUser" ? -debt.amount : debt.amount

      const updatedClient = await tx.client.update({
        where: { id: client.id },
        data: { totalDebt: client.totalDebt + adjustment },
      })

      const updatedDebt = await tx.debt.update({
        where: { id },
        data: { status: "paid" },
      })

      return { debt: updatedDebt, client: updatedClient }
    })

    if (!result) {
      return NextResponse.json({ error: "Debt not found" }, { status: 404 })
    }

    return NextResponse.json({
      client: result.client,
      debt: {
        ...result.debt,
        direction: result.debt.direction as "owedToUser" | "owedByUser",
        status: result.debt.status as "active" | "paid",
        date: result.debt.date.toISOString(),
        dueDate: result.debt.dueDate ? result.debt.dueDate.toISOString() : undefined,
      },
    })
  } catch (error) {
    console.error("Failed to mark debt as paid", error)
    return NextResponse.json({ error: "Failed to update debt" }, { status: 500 })
  }
}
