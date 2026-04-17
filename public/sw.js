self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {}
  const title = payload.title || "SavdoBot"
  const body = payload.body || "Новое уведомление"
  const url = payload.url || "/"

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      data: { url },
      vibrate: [200, 100, 200],
      tag: "savdobot-reminder",
      renotify: true,
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || "/"

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ("focus" in client) {
          client.navigate(targetUrl)
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
      return undefined
    })
  )
})
