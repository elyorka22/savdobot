import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reminder = await prisma.reminder.update({
      where: { id },
      data: { notified: true },
    })

    return NextResponse.json({
      ...reminder,
      status: reminder.status as "active" | "done",
      eventAt: reminder.eventAt.toISOString(),
      remindAt: reminder.remindAt.toISOString(),
      createdAt: reminder.createdAt.toISOString(),
    })
  } catch (error) {
    console.error("Failed to mark reminder notified", error)
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 })
  }
}
