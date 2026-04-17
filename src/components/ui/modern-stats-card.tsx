"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ModernStatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
    period?: string
  }
  icon?: LucideIcon
  description?: string
  className?: string
  gradient?: "primary" | "secondary" | "accent" | "success" | "warning"
  size?: "sm" | "md" | "lg"
}

export function ModernStatsCard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  gradient = "primary",
  size = "md"
}: ModernStatsCardProps) {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary", 
    accent: "bg-gradient-accent",
    success: "bg-gradient-success",
    warning: "bg-gradient-warning"
  }

  const glowClasses = {
    primary: "shadow-glow-primary",
    secondary: "shadow-glow-secondary",
    accent: "shadow-glow-accent", 
    success: "shadow-glow-success",
    warning: "shadow-glow-warning"
  }

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  const valueSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  }

  const getChangeIcon = () => {
    switch (change?.type) {
      case "increase":
        return <TrendingUp className="h-3 w-3" />
      case "decrease":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getChangeColor = () => {
    switch (change?.type) {
      case "increase":
        return "text-success"
      case "decrease":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 glass hover-bright transition-all duration-300",
      sizeClasses[size],
      className
    )}>
      {/* Gradient background decoration */}
      <div className={cn(
        "absolute top-0 right-0 h-24 w-24 rounded-full opacity-10 blur-2xl",
        gradientClasses[gradient]
      )} />
      
      <CardContent className="relative p-0">
        <div className={sizeClasses[size]}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {description && (
                <p className="text-xs text-muted-foreground/70">{description}</p>
              )}
            </div>
            
            {Icon && (
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                gradientClasses[gradient],
                glowClasses[gradient]
              )}>
                <Icon className={cn("text-white", iconSizes[size])} />
              </div>
            )}
          </div>

          {/* Value */}
          <div className="space-y-2">
            <div className={cn(
              "font-bold tracking-tight",
              valueSizes[size],
              "text-foreground"
            )}>
              {value}
            </div>

            {/* Change indicator */}
            {change && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  getChangeColor(),
                  change.type === "increase" && "bg-success/10",
                  change.type === "decrease" && "bg-destructive/10",
                  change.type === "neutral" && "bg-muted/50"
                )}>
                  {getChangeIcon()}
                  <span>{Math.abs(change.value)}%</span>
                </div>
                {change.period && (
                  <span className="text-xs text-muted-foreground">
                    {change.period}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Grid component for stats cards
interface ModernStatsGridProps {
  children: React.ReactNode
  className?: string
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function ModernStatsGrid({ 
  children, 
  className, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 } 
}: ModernStatsGridProps) {
  const gridClasses: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2", 
    3: "grid-cols-3",
    4: "grid-cols-4"
  }

  return (
    <div className={cn(
      "grid gap-4",
      gridClasses[columns.sm || 1],
      columns.md && `md:${gridClasses[columns.md]}`,
      columns.lg && `lg:${gridClasses[columns.lg]}`,
      columns.xl && `xl:${gridClasses[columns.xl]}`,
      className
    )}>
      {children}
    </div>
  )
}
