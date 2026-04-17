"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Heart, 
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp
} from "lucide-react"

export default function ColorsPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient-primary">
              Modern Color Palette
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Bright, modern, and vibrant design system for SavdoBot
          </p>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 glass hover-glow">
            <div className="space-y-4">
              <div className="h-20 rounded-xl bg-gradient-primary shadow-glow-primary"></div>
              <div>
                <h3 className="font-semibold text-foreground">Primary</h3>
                <p className="text-sm text-muted-foreground">Bright Blue</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">hsl(221 83% 53%)</code>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass hover-glow">
            <div className="space-y-4">
              <div className="h-20 rounded-xl bg-gradient-secondary shadow-glow-secondary"></div>
              <div>
                <h3 className="font-semibold text-foreground">Secondary</h3>
                <p className="text-sm text-muted-foreground">Bright Purple</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">hsl(274 91% 67%)</code>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass hover-glow">
            <div className="space-y-4">
              <div className="h-20 rounded-xl bg-gradient-accent shadow-glow-accent"></div>
              <div>
                <h3 className="font-semibold text-foreground">Accent</h3>
                <p className="text-sm text-muted-foreground">Bright Pink</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">hsl(340 82% 52%)</code>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass hover-glow">
            <div className="space-y-4">
              <div className="h-20 rounded-xl bg-gradient-success shadow-glow-success"></div>
              <div>
                <h3 className="font-semibold text-foreground">Success</h3>
                <p className="text-sm text-muted-foreground">Bright Green</p>
                <code className="text-xs bg-muted px-2 py-1 rounded">hsl(142 71% 45%)</code>
              </div>
            </div>
          </Card>
        </div>

        {/* UI Components Showcase */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Component Showcase</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 text-foreground">Buttons</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-primary shadow-glow-primary hover-bright">
                  Primary Button
                </Button>
                <Button variant="secondary" className="w-full bg-gradient-secondary shadow-glow-secondary hover-bright">
                  Secondary Button
                </Button>
                <Button variant="outline" className="w-full hover-bright hover-glow">
                  Outline Button
                </Button>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 text-foreground">Badges</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-primary text-white">Primary</Badge>
                  <Badge className="bg-gradient-secondary text-white">Secondary</Badge>
                  <Badge className="bg-gradient-accent text-white">Accent</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/20 text-primary">Outline</Badge>
                  <Badge variant="secondary">Muted</Badge>
                  <Badge className="bg-gradient-success text-white">Success</Badge>
                </div>
              </div>
            </Card>

            {/* Progress Bars */}
            <Card className="p-6 glass">
              <h3 className="font-semibold mb-4 text-foreground">Progress</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Primary</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-primary/20" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Secondary</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2 bg-secondary/20" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success</span>
                    <span>90%</span>
                  </div>
                  <Progress value={90} className="h-2 bg-success/20" />
                </div>
              </div>
            </Card>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 glass border-success/20 hover-glow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-success flex items-center justify-center shadow-glow-success">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Success</h3>
                  <p className="text-sm text-muted-foreground">Operation completed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass border-warning/20 hover-glow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-warning flex items-center justify-center shadow-glow-warning">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Warning</h3>
                  <p className="text-sm text-muted-foreground">Attention needed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass border-primary/20 hover-glow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Info</h3>
                  <p className="text-sm text-muted-foreground">Information</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass border-accent/20 hover-glow">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow-accent">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Growth</h3>
                  <p className="text-sm text-muted-foreground">+25% increase</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Features */}
          <Card className="p-8 glass">
            <h3 className="text-xl font-semibold mb-6 text-center text-gradient-primary">
              Modern Design Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Gradient Effects</h4>
                  <p className="text-sm text-muted-foreground">Beautiful color transitions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-secondary flex items-center justify-center shadow-glow-secondary">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Glow Effects</h4>
                  <p className="text-sm text-muted-foreground">Subtle shadow glows</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-accent flex items-center justify-center shadow-glow-accent">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Glass Morphism</h4>
                  <p className="text-sm text-muted-foreground">Modern frosted glass</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-success flex items-center justify-center shadow-glow-success">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Bright Colors</h4>
                  <p className="text-sm text-muted-foreground">Vibrant and modern palette</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-primary animate-pulse-glow">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Animations</h4>
                  <p className="text-sm text-muted-foreground">Smooth transitions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-secondary flex items-center justify-center shadow-glow-secondary">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Hover Effects</h4>
                  <p className="text-sm text-muted-foreground">Interactive feedback</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Animated Background Demo */}
        <Card className="p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-animated opacity-10"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gradient-primary">
              Animated Gradient Background
            </h3>
            <p className="text-muted-foreground mb-6">
              Experience smooth color transitions with our animated gradients
            </p>
            <Button className="bg-gradient-primary shadow-glow-primary hover-bright">
              Try Interactive Demo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
