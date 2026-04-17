"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Eye, 
  EyeOff,
  Loader2,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "number" | "email" | "password" | "tel"
  placeholder?: string
  required?: boolean
  validation?: (value: string) => string | null
  helperText?: string
  className?: string
  icon?: React.ReactNode
}

interface ModernFormProps {
  title?: string
  subtitle?: string
  fields: FormFieldProps[]
  onSubmit: (data: Record<string, string>) => void | Promise<void>
  submitText?: string
  loading?: boolean
  className?: string
  showProgress?: boolean
}

export function ModernForm({
  title,
  subtitle,
  fields,
  onSubmit,
  submitText = "Submit",
  loading = false,
  className,
  showProgress = false
}: ModernFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate form progress
  const filledFields = Object.keys(formData).filter(key => formData[key]).length
  const progress = showProgress ? (filledFields / fields.length) * 100 : 0

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate field if it's been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const validateField = (name: string, value: string) => {
    const field = fields.find(f => f.name === name)
    if (!field) return

    let error: string | null = null

    // Required validation
    if (field.required && (!value || value.trim() === "")) {
      error = `${field.label} is required`
    }
    // Custom validation
    else if (field.validation && value) {
      error = field.validation(value)
    }

    setErrors(prev => ({ ...prev, [name]: error || "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach(field => {
      const value = formData[field.name] || ""
      
      if (field.required && (!value || value.trim() === "")) {
        newErrors[field.name] = `${field.label} is required`
        isValid = false
      } else if (field.validation && value) {
        const error = field.validation(value)
        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])))
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = (name: string) => {
    setShowPasswords(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const getFieldIcon = (field: FormFieldProps) => {
    if (field.type === "password") {
      return (
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field.name)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPasswords[field.name] ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      )
    }
    return field.icon
  }

  return (
    <Card className={cn("glass max-w-2xl mx-auto", className)}>
      {(title || subtitle) && (
        <CardHeader className="text-center pb-6">
          {title && (
            <CardTitle className="text-2xl font-bold text-gradient-primary mb-2">
              {title}
            </CardTitle>
          )}
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </CardHeader>
      )}

      <CardContent className="space-y-6">
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Form Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.name} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <Label 
                htmlFor={field.name}
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  errors[field.name] && "text-destructive"
                )}
              >
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>

              <div className="relative">
                <Input
                  id={field.name}
                  type={showPasswords[field.name] && field.type === "password" ? "text" : field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  onBlur={() => handleBlur(field.name)}
                  className={cn(
                    "pr-10 transition-all duration-200",
                    errors[field.name] 
                      ? "border-destructive focus:border-destructive" 
                      : "focus:border-primary/50",
                    touched[field.name] && !errors[field.name] && formData[field.name] && "border-success/50"
                  )}
                />
                
                {getFieldIcon(field) && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {getFieldIcon(field)}
                  </div>
                )}

                {/* Field status indicator */}
                {touched[field.name] && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {errors[field.name] ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : formData[field.name] ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : null}
                  </div>
                )}
              </div>

              {field.helperText && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{field.helperText}</span>
                </div>
              )}

              {errors[field.name] && (
                <div className="flex items-center gap-2 text-xs text-destructive animate-fade-in">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors[field.name]}</span>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-gradient-primary shadow-glow-primary hover-bright"
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {submitText}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({})
                setErrors({})
                setTouched({})
              }}
              className="glass"
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Quick form for simple inputs
interface QuickFormProps {
  placeholder?: string
  onSubmit: (value: string) => void
  buttonText?: string
  loading?: boolean
  className?: string
}

export function QuickForm({ 
  placeholder = "Enter value...", 
  onSubmit, 
  buttonText = "Add",
  loading = false,
  className 
}: QuickFormProps) {
  const [value, setValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSubmit(value.trim())
      setValue("")
    } catch (error) {
      console.error("Quick form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex gap-2", className)}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-background/50 border-muted/50 focus:border-primary/50"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        disabled={!value.trim() || isSubmitting}
        className="bg-gradient-primary shadow-glow-primary hover-bright"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          buttonText
        )}
      </Button>
    </form>
  )
}

// Form with steps
interface StepFormProps {
  steps: Array<{
    title: string
    fields: FormFieldProps[]
  }>
  onSubmit: (data: Record<string, string>) => void | Promise<void>
  className?: string
}

export function StepForm({ steps, onSubmit, className }: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className={cn("glass max-w-2xl mx-auto", className)}>
      <CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gradient-primary">
              Step {currentStep + 1} of {steps.length}
            </h2>
            <Badge variant="outline">{Math.round(progress)}%</Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <h3 className="text-lg font-medium">{currentStepData.title}</h3>
        </div>
      </CardHeader>

      <CardContent>
        <ModernForm
          fields={currentStepData.fields}
          onSubmit={onSubmit}
          submitText={currentStep === steps.length - 1 ? "Complete" : "Next Step"}
          className="border-0 shadow-none bg-transparent p-0"
        />

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="glass"
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="bg-gradient-primary shadow-glow-primary">
              Next Step
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
