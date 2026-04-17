"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error Boundary caught an error:", error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        
        <p className="mb-4 text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred. Please try again."}
        </p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm font-mono text-muted-foreground hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
              {error.stack}
            </pre>
          </details>
        )}
        
        <Button onClick={reset} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </Card>
    </div>
  )
}

// Hook for handling async errors in function components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    console.error("Async error captured:", error)
    setError(error)
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error)
    }
  }, [])

  // Throw error to be caught by ErrorBoundary
  if (error) {
    throw error
  }

  return { captureError, resetError }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
