import * as webpush from "web-push"

let configured = false

function ensureConfigured() {
  if (configured) return true

  const subject = process.env.WEB_PUSH_SUBJECT
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!subject || !publicKey || !privateKey) {
    return false
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

export async function sendWebPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string }
) {
  if (!ensureConfigured()) {
    return { sent: false, reason: "web_push_not_configured" as const }
  }

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload), {
      urgency: "high",
      TTL: 60 * 60,
    })
    return { sent: true as const }
  } catch (error: unknown) {
    const statusCode =
      typeof error === "object" && error && "statusCode" in error
        ? Number((error as { statusCode?: number }).statusCode)
        : undefined

    return {
      sent: false as const,
      invalidSubscription: statusCode === 404 || statusCode === 410,
      error,
    }
  }
}
