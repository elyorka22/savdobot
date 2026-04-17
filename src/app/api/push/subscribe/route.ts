import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type PushSubscriptionInput = {
  endpoint?: string
  keys?: {
    p256dh?: string
    auth?: string
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PushSubscriptionInput

    if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
      return NextResponse.json({ error: "Invalid push subscription" }, { status: 400 })
    }

    await prisma.webPushSubscription.upsert({
      where: { endpoint: body.endpoint },
      create: {
        endpoint: body.endpoint,
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
      update: {
        p256dh: body.keys.p256dh,
        auth: body.keys.auth,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to save push subscription", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
