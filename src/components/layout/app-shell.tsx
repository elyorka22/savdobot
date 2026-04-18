"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  MessageSquare, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Sun,
  Moon,
  Languages,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { translations } from "@/lib/translations"
import { toast } from "@/hooks/use-toast"

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { state, setLanguage, markReminderNotified } = useAppStore()
  const t = translations[state.language as keyof typeof translations] || translations.ru

  const navigationItems = [
    { name: t.nav.assistant, href: "/", icon: MessageSquare },
    { name: t.nav.sales, href: "/sales", icon: ShoppingCart },
    { name: t.nav.debts, href: "/debts", icon: CreditCard },
    { name: t.nav.clients, href: "/clients", icon: Users },
    { name: t.nav.analytics, href: "/reports", icon: TrendingUp },
    { name: t.nav.memories, href: "/memories", icon: Bell },
  ]

  React.useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return

    const registerPush = async () => {
      try {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) return

        const registration = await navigator.serviceWorker.register("/sw.js")
        const permission = await Notification.requestPermission()
        if (permission !== "granted") return

        const existing = await registration.pushManager.getSubscription()
        const subscription =
          existing ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          }))

        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        })
      } catch (error) {
        console.error("Failed to register push notifications", error)
      }
    }

    registerPush()
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch("/api/reminders/dispatch", {
          method: "POST",
          cache: "no-store",
        })

        if (response.status === 401) {
          // In production dispatch is expected to be called by secure cron.
          return
        }

        if (!response.ok) {
          throw new Error("Dispatch request failed")
        }

        const payload = (await response.json()) as { dispatched?: Array<{ id: string; text: string }> }
        const dispatched = payload.dispatched ?? []

        dispatched.forEach((item) => {
          toast({
            title: "Напоминание",
            description: item.text,
          })
          void markReminderNotified(item.id)
        })
      } catch (error) {
        console.error("Failed to dispatch reminders", error)
      }
    }, 30000)

    return () => window.clearInterval(interval)
  }, [markReminderNotified])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body">
        
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b px-4 py-3 md:px-6 md:py-4 bg-gradient-primary">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-white/20 border border-white/30 shadow-glow-primary md:backdrop-blur-sm">
                <LayoutDashboard className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tight text-white group-data-[collapsible=icon]:hidden">
                Savdo<span className="text-white/80">Bot</span>
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-1 py-2 md:px-2 md:py-4">
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.name}
                      className={cn(
                        "h-10 md:h-11 px-3 md:px-4 transition-all hover-bright",
                        isActive 
                          ? "bg-gradient-primary text-white font-semibold shadow-glow-primary" 
                          : "hover:bg-gradient-secondary/10 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("h-4 w-4 md:h-5 md:w-5", isActive ? "text-white" : "text-muted-foreground")} />
                        <span className="text-[13px] md:text-[15px]">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t p-3 md:p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 md:h-11 px-3 md:px-4 text-muted-foreground hover:text-foreground">
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-[13px] md:text-[15px]">{t.nav.settings}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 md:h-11 px-3 md:px-4 text-destructive hover:bg-destructive/5">
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="text-[13px] md:text-[15px]">{t.nav.logout}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile-friendly header */}
          <header className="flex h-14 md:h-16 items-center justify-between border-b bg-background/80 px-3 md:px-6 md:backdrop-blur-md glass">
            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <SidebarTrigger className="hover-bright h-8 w-8" />
              <h1 className="text-sm md:text-lg font-semibold text-gradient-primary truncate">
                {navigationItems.find(i => i.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile-optimized language switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover-bright hover-glow">
                    <Languages className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass">
                  <DropdownMenuItem onClick={() => setLanguage('ru')} className="hover-bright text-sm">
                    Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('uz')} className="hover-bright text-sm">
                    O'zbekcha
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme toggle */}
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10 rounded-full hover-bright hover-glow">
                <Sun className="h-4 w-4 md:h-5 md:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 md:h-5 md:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              
              {/* User avatar */}
              <div className="h-8 w-8 md:h-9 md:w-9 overflow-hidden rounded-full border-2 border-primary shadow-glow-primary bg-gradient-primary p-0.5 md:p-1">
                <div className="h-full w-full rounded-full bg-primary/20" />
              </div>
            </div>
          </header>
          
          {/* Responsive content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 md:p-4 lg:p-8">
              <div className="mx-auto max-w-full lg:max-w-6xl">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
