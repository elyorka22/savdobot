"use client"

import React from "react"
import { cn } from "@/lib/utils"

// Animated fade-in component
interface AnimatedFadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function AnimatedFadeIn({ 
  children, 
  delay = 0, 
  duration = 500,
  direction = "up",
  className 
}: AnimatedFadeInProps) {
  const getTransform = () => {
    switch (direction) {
      case "up": return "translateY(20px)"
      case "down": return "translateY(-20px)"
      case "left": return "translateX(20px)"
      case "right": return "translateX(-20px)"
      default: return "translateY(20px)"
    }
  }

  return (
    <div
      className={cn(
        "animate-fade-in",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        "--tw-translate-y": direction === "up" ? "20px" : direction === "down" ? "-20px" : "0px",
        "--tw-translate-x": direction === "left" ? "20px" : direction === "right" ? "-20px" : "0px",
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Stagger animation for lists
interface AnimatedListProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export function AnimatedList({ children, staggerDelay = 100, className }: AnimatedListProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => (
        <AnimatedFadeIn key={index} delay={index * staggerDelay}>
          {child}
        </AnimatedFadeIn>
      ))}
    </div>
  )
}

// Pulse animation for important elements
interface AnimatedPulseProps {
  children: React.ReactNode
  className?: string
  intensity?: "subtle" | "normal" | "strong"
}

export function AnimatedPulse({ children, className, intensity = "normal" }: AnimatedPulseProps) {
  const intensityClasses = {
    subtle: "animate-pulse",
    normal: "animate-pulse",
    strong: "animate-pulse"
  }

  return (
    <div className={cn(intensityClasses[intensity], className)}>
      {children}
    </div>
  )
}

// Scale animation on hover
interface AnimatedScaleProps {
  children: React.ReactNode
  scale?: number
  className?: string
}

export function AnimatedScale({ children, scale = 1.05, className }: AnimatedScaleProps) {
  return (
    <div 
      className={cn("transition-transform duration-300 hover:scale-105", className)}
      style={{ '--tw-scale': scale } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Skeleton loading animation
interface AnimatedSkeletonProps {
  className?: string
  lines?: number
  height?: string
}

export function AnimatedSkeleton({ className, lines = 3, height = "h-4" }: AnimatedSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "bg-muted rounded animate-pulse",
            height,
            i === lines - 1 && "w-3/4"
          )} 
          style={{
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  )
}

// Slide and reveal animation
interface AnimatedSlideRevealProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  className?: string
}

export function AnimatedSlideReveal({ 
  children, 
  direction = "left", 
  delay = 0,
  className 
}: AnimatedSlideRevealProps) {
  return (
    <div
      className={cn(
        "animate-slide-in overflow-hidden",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Bounce animation for notifications
interface AnimatedBounceProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedBounce({ children, className }: AnimatedBounceProps) {
  return (
    <div className={cn("animate-bounce", className)}>
      {children}
    </div>
  )
}

// Progress bar animation
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showValue?: boolean
  color?: "primary" | "secondary" | "accent" | "success" | "warning" | "destructive"
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className,
  showValue = false,
  color = "primary"
}: AnimatedProgressProps) {
  const percentage = (value / max) * 100
  const colorClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    accent: "bg-gradient-accent",
    success: "bg-gradient-success",
    warning: "bg-gradient-warning",
    destructive: "bg-gradient-destructive"
  }

  return (
    <div className={cn("w-full", className)}>
      {showValue && (
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Floating animation for decorative elements
interface AnimatedFloatProps {
  children: React.ReactNode
  duration?: number
  amplitude?: number
  className?: string
}

export function AnimatedFloat({ 
  children, 
  duration = 3000, 
  amplitude = 10,
  className 
}: AnimatedFloatProps) {
  return (
    <div 
      className={cn("inline-block", className)}
      style={{
        animation: `float ${duration}ms ease-in-out infinite`,
        "--float-amplitude": `${amplitude}px`
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

// Typing animation for text
interface AnimatedTypingProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function AnimatedTyping({ text, speed = 50, className, onComplete }: AnimatedTypingProps) {
  const [displayText, setDisplayText] = React.useState("")
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={cn("font-mono", className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Shimmer effect for loading states
interface AnimatedShimmerProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedShimmer({ children, className }: AnimatedShimmerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      {children}
    </div>
  )
}

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ 
  value, 
  duration = 1000, 
  className,
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0)

  React.useEffect(() => {
    const startTime = Date.now()
    const endTime = startTime + duration

    const updateCounter = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(value * easeOutQuart)
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [value, duration])

  return (
    <span className={cn("font-bold", className)}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  )
}
