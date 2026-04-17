import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWebPushNotification } from "@/lib/web-push"

export async function POST(request: Request) {
  try {
    const expectedSecret = process.env.REMINDER_DISPATCH_SECRET
    if (expectedSecret) {
      const providedSecret = request.headers.get("x-cron-secret")
      if (providedSecret !== expectedSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: "active",
        notified: false,
        remindAt: { lte: new Date() },
      },
      orderBy: { remindAt: "asc" },
      take: 20,
    })

    if (dueReminders.length === 0) {
      return NextResponse.json({ dispatched: [] })
    }

    const subscriptions = await prisma.webPushSubscription.findMany()
    const dispatched: Array<{ id: string; text: string }> = []
    const invalidEndpoints = new Set<string>()

    for (const reminder of dueReminders) {
      let sentAtLeastOnce = false

      for (const subscription of subscriptions) {
        const result = await sendWebPushNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          {
            title: "Напоминание SavdoBot",
            body: reminder.text,
            url: "/memories",
          }
        )

        if (result.sent) {
          sentAtLeastOnce = true
        } else if (result.invalidSubscription) {
          invalidEndpoints.add(subscription.endpoint)
        }
      }

      // Mark as notified even without subscriptions to avoid infinite retry storms.
      if (sentAtLeastOnce || subscriptions.length === 0) {
        await prisma.reminder.update({
          where: { id: reminder.id },
          data: { notified: true },
        })
        dispatched.push({ id: reminder.id, text: reminder.text })
      }
    }

    if (invalidEndpoints.size > 0) {
      await prisma.webPushSubscription.deleteMany({
        where: {
          endpoint: {
            in: Array.from(invalidEndpoints),
          },
        },
      })
    }

    return NextResponse.json({ dispatched })
  } catch (error) {
    console.error("Failed to dispatch reminders", error)
    return NextResponse.json({ error: "Failed to dispatch reminders" }, { status: 500 })
  }
}
