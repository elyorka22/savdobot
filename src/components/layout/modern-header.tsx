"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun,
  Menu,
  X,
  Home,
  TrendingUp,
  ShoppingCart,
  Users,
  CreditCard,
  FileText,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ModernHeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function ModernHeader({ title, subtitle, actions }: ModernHeaderProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation items for mobile menu
  const navItems = [
    { href: "/", icon: Home, label: "Assistant" },
    { href: "/sales", icon: ShoppingCart, label: "Sales" },
    { href: "/debts", icon: CreditCard, label: "Debts" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/reports", icon: TrendingUp, label: "Reports" },
    { href: "/memories", icon: Calendar, label: "Reminders" },
  ]

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ href: "/", label: "Home" }]
    
    let currentPath = ""
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = navItems.find(item => item.href === currentPath)?.label || 
                   segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ href: currentPath, label })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 md:backdrop-blur-lg glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Mobile menu toggle and breadcrumbs */}
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && (
                    <span className="text-muted-foreground/50">/</span>
                  )}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      index === breadcrumbs.length - 1
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className={cn(
              "relative transition-all duration-300",
              isSearchOpen ? "w-full" : "w-64"
            )}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search anything..."
                className="pl-10 bg-background/50 border-muted/50 focus:border-primary/50"
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-primary text-xs">
                3
              </Badge>
            </Button>

            {/* Actions */}
            {actions}

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Documentation</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                  <X className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page title and subtitle */}
        {(title || subtitle) && (
          <div className="border-t bg-background/50 md:backdrop-blur-sm px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary">{title}</h1>
                {subtitle && (
                  <p className="text-muted-foreground mt-1">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="hidden md:flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 md:backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-background shadow-xl animate-slide-in">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gradient-primary">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-gradient-primary text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
