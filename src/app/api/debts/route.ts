import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      clientName?: string
      amount?: number
      direction?: "owedToUser" | "owedByUser"
      description?: string
      dueDate?: string
    }

    if (!body.clientName || !body.amount || !body.direction || !body.description) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const clientName = body.clientName
    const amount = body.amount
    const direction = body.direction
    const description = body.description

    const adjustment = direction === "owedToUser" ? amount : -amount

    const result = await prisma.$transaction(async (tx) => {
      const existingClient = await tx.client.findFirst({
        where: { name: { equals: body.clientName, mode: "insensitive" } },
      })

      const client = existingClient
        ? await tx.client.update({
            where: { id: existingClient.id },
            data: { totalDebt: existingClient.totalDebt + adjustment },
          })
        : await tx.client.create({
            data: {
              name: clientName,
              totalDebt: adjustment,
            },
          })

      const debt = await tx.debt.create({
        data: {
          clientId: client.id,
          clientName: client.name,
          amount,
          direction,
          description,
          dueDate: body.dueDate ? new Date(body.dueDate) : null,
          status: "active",
        },
      })

      return { client, debt }
    })

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
    console.error("Failed to create debt", error)
    return NextResponse.json({ error: "Failed to create debt" }, { status: 500 })
  }
}
