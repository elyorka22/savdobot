"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  ModernHeader, 
  ModernStatsCard, 
  ModernStatsGrid 
} from "@/components/layout/modern-header"
import { ModernStatsCard as StatsCard } from "@/components/ui/modern-stats-card"
import { ModernTable } from "@/components/ui/modern-table"
import { ModernForm, QuickForm } from "@/components/ui/modern-form"
import { ThemeSelector } from "@/components/ui/theme-provider"
import {
  AnimatedFadeIn,
  AnimatedList,
  AnimatedPulse,
  AnimatedScale,
  AnimatedSkeleton,
  AnimatedSlideReveal,
  AnimatedBounce,
  AnimatedProgress,
  AnimatedFloat,
  AnimatedTyping,
  AnimatedShimmer,
  AnimatedCounter
} from "@/components/ui/animated-elements"
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Rocket,
  Target,
  Award,
  Lightbulb,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

export default function UXShowcase() {
  const [formData, setFormData] = useState({})
  const [quickValue, setQuickValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Sample data for table
  const sampleData = [
    { id: "1", name: "John Doe", email: "john@example.com", status: "Active", amount: 5000 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Pending", amount: 3000 },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active", amount: 8000 },
  ]

  const tableColumns = [
    {
      key: "name" as const,
      title: "Name",
      sortable: true,
      searchable: true,
    },
    {
      key: "email" as const,
      title: "Email",
      sortable: true,
      searchable: true,
    },
    {
      key: "status" as const,
      title: "Status",
      sortable: true,
      searchable: false,
      render: (value: string) => (
        <Badge variant={value === "Active" ? "default" : "secondary"}>
          {value}
        </Badge>
      )
    },
    {
      key: "amount" as const,
      title: "Amount",
      sortable: true,
      searchable: false,
      render: (value: number) => `$${value.toLocaleString()}`,
      className: "text-right"
    }
  ]

  const handleFormSubmit = async (data: Record<string, string>) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setFormData(data)
    setIsLoading(false)
  }

  const handleQuickSubmit = async (value: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setQuickValue("")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <ModernHeader
        title="UX/UI Showcase"
        subtitle="Modern design system and user experience improvements"
        actions={<ThemeSelector />}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <AnimatedFadeIn>
            <Card className="glass border-primary/20 bg-gradient-primary/5">
              <CardContent className="p-8 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-primary mb-6">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gradient-primary mb-4">
                  Modern UX/UI Experience
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Experience the future of web design with our enhanced user interface, 
                  featuring smooth animations, responsive layouts, and intuitive interactions.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Badge className="bg-gradient-primary text-white">Modern Design</Badge>
                  <Badge className="bg-gradient-secondary text-white">Responsive</Badge>
                  <Badge className="bg-gradient-accent text-white">Accessible</Badge>
                  <Badge className="bg-gradient-success text-white">Fast</Badge>
                </div>
              </CardContent>
            </Card>
          </AnimatedFadeIn>

          {/* Stats Cards */}
          <AnimatedFadeIn delay={200}>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gradient-primary">Performance Metrics</h2>
              <ModernStatsGrid>
                <StatsCard
                  title="Page Speed"
                  value="98"
                  change={{ value: 12, type: "increase", period: "vs last week" }}
                  icon={Zap}
                  description="Load time score"
                  gradient="primary"
                />
                <StatsCard
                  title="User Satisfaction"
                  value="94%"
                  change={{ value: 8, type: "increase", period: "vs last month" }}
                  icon={Heart}
                  description="Customer rating"
                  gradient="success"
                />
                <StatsCard
                  title="Conversion Rate"
                  value="4.2%"
                  change={{ value: 15, type: "increase", period: "vs last quarter" }}
                  icon={Target}
                  description="Goal completion"
                  gradient="accent"
                />
                <StatsCard
                  title="Active Users"
                  value="1.2K"
                  change={{ value: 23, type: "increase", period: "vs last month" }}
                  icon={Users}
                  description="Daily engagement"
                  gradient="secondary"
                />
              </ModernStatsGrid>
            </div>
          </AnimatedFadeIn>

          {/* Animations Showcase */}
          <AnimatedFadeIn delay={400}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gradient-primary">Interactive Elements</h2>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Fade In Animation */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Fade In Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatedList>
                      <div className="p-3 bg-muted/50 rounded-lg">Item 1</div>
                      <div className="p-3 bg-muted/50 rounded-lg">Item 2</div>
                      <div className="p-3 bg-muted/50 rounded-lg">Item 3</div>
                    </AnimatedList>
                  </CardContent>
                </Card>

                {/* Pulse Animation */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Pulse Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatedPulse>
                      <div className="h-12 bg-gradient-primary rounded-lg"></div>
                    </AnimatedPulse>
                    <AnimatedBounce>
                      <div className="h-12 bg-gradient-accent rounded-lg flex items-center justify-center text-white">
                        <Star className="h-6 w-6" />
                      </div>
                    </AnimatedBounce>
                  </CardContent>
                </Card>

                {/* Progress Animation */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Progress Bars
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatedProgress value={75} color="primary" showValue />
                    <AnimatedProgress value={60} color="success" showValue />
                    <AnimatedProgress value={90} color="accent" showValue />
                  </CardContent>
                </Card>
              </div>

              {/* Counter and Typing */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Dynamic Counter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <AnimatedCounter value={1234} duration={2000} prefix="$" suffix=" total" />
                      <p className="text-sm text-muted-foreground mt-2">Revenue this month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Typing Effect
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatedTyping 
                      text="Welcome to the future of UX!" 
                      speed={50}
                      className="text-lg"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedFadeIn>

          {/* Forms Showcase */}
          <AnimatedFadeIn delay={600}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gradient-primary">Enhanced Forms</h2>
              
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Modern Form */}
                <ModernForm
                  title="Contact Form"
                  subtitle="Get in touch with us"
                  fields={[
                    {
                      label: "Name",
                      name: "name",
                      type: "text",
                      placeholder: "Enter your name",
                      required: true,
                      validation: (value) => {
                        if (value.length < 2) return "Name must be at least 2 characters"
                        return null
                      }
                    },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      placeholder: "Enter your email",
                      required: true,
                      validation: (value) => {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                          return "Please enter a valid email"
                        }
                        return null
                      }
                    },
                    {
                      label: "Message",
                      name: "message",
                      type: "text",
                      placeholder: "Type your message here",
                      required: true,
                      validation: (value) => {
                        if (value.length < 10) return "Message must be at least 10 characters"
                        return null
                      }
                    }
                  ]}
                  onSubmit={handleFormSubmit}
                  loading={isLoading}
                  showProgress={true}
                />

                {/* Quick Form */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Add new item quickly:</p>
                      <QuickForm
                        placeholder="Enter item name..."
                        onSubmit={handleQuickSubmit}
                        buttonText="Add Item"
                        loading={isLoading}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Recent additions:</p>
                      {quickValue && (
                        <AnimatedFadeIn>
                          <div className="p-2 bg-success/10 border border-success/20 rounded-lg text-sm">
                            Added: {quickValue}
                          </div>
                        </AnimatedFadeIn>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedFadeIn>

          {/* Modern Table */}
          <AnimatedFadeIn delay={800}>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gradient-primary">Interactive Tables</h2>
              <ModernTable
                data={sampleData}
                columns={tableColumns}
                title="User Management"
                subtitle="Manage your team members"
                searchable={true}
                selectable={true}
                actions={{
                  view: (row) => console.log("View:", row),
                  edit: (row) => console.log("Edit:", row),
                  delete: (row) => console.log("Delete:", row)
                }}
              />
            </div>
          </AnimatedFadeIn>

          {/* Loading States */}
          <AnimatedFadeIn delay={1000}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gradient-primary">Loading States</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Skeleton Loading
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <AnimatedSkeleton lines={3} />
                    <AnimatedSkeleton lines={2} height="h-6" />
                    <AnimatedSkeleton lines={4} />
                  </CardContent>
                </Card>

                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Shimmer Effect
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AnimatedShimmer>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </div>
                    </AnimatedShimmer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedFadeIn>
        </div>
      </div>
    </div>
  )
}
