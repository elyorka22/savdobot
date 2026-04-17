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
    if (typeof window === "undefined") return

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {})
    }

    const interval = window.setInterval(() => {
      const now = Date.now()
      const dueReminders = (state.reminders || []).filter((item) => {
        if (item.status !== "active" || item.notified) return false
        return new Date(item.remindAt).getTime() <= now
      })

      dueReminders.forEach((item) => {
        toast({
          title: "Напоминание",
          description: item.text,
        })

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Напоминание SavdoBot", { body: item.text })
        }

        void markReminderNotified(item.id)
      })
    }, 30000)

    return () => window.clearInterval(interval)
  }, [state.reminders, markReminderNotified])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-body">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                Savdo<span className="text-primary">Bot</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
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
                        "h-11 px-4 transition-all hover:bg-primary/5",
                        isActive && "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="text-[15px]">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 px-4 text-muted-foreground hover:text-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="text-[15px]">{t.nav.settings}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-11 px-4 text-destructive hover:bg-destructive/5">
                  <LogOut className="h-5 w-5" />
                  <span className="text-[15px]">{t.nav.logout}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md dark:bg-zinc-950/80">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold text-foreground">
                {navigationItems.find(i => i.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('ru')}>
                    Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('uz')}>
                    O'zbekcha
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon" className="rounded-full">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <div className="ml-2 h-9 w-9 overflow-hidden rounded-full border-2 border-primary/20 bg-primary/10 p-1">
                <div className="h-full w-full rounded-full bg-primary/20" />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
