import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: string; eventAt?: string; remindAt?: string }
    if (!body.text || !body.eventAt || !body.remindAt) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const reminder = await prisma.reminder.create({
      data: {
        text: body.text,
        eventAt: new Date(body.eventAt),
        remindAt: new Date(body.remindAt),
        notified: false,
        status: "active",
      },
    })

    return NextResponse.json({
      ...reminder,
      status: reminder.status as "active" | "done",
      eventAt: reminder.eventAt.toISOString(),
      remindAt: reminder.remindAt.toISOString(),
      createdAt: reminder.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Failed to create reminder", error)
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 })
  }
}
