type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  userId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel: LogLevel = this.getLogLevel();

  private getLogLevel(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toLowerCase();
    if (envLevel === 'debug' || envLevel === 'info' || envLevel === 'warn' || envLevel === 'error') {
      return envLevel;
    }
    return this.isDevelopment ? 'debug' : 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      logString += ` | Context: ${JSON.stringify(context)}`;
    }
    
    return logString;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formattedLog = this.formatLog(entry);

    // Console output for development
    if (this.isDevelopment) {
      switch (level) {
        case 'debug':
          console.debug(formattedLog);
          break;
        case 'info':
          console.info(formattedLog);
          break;
        case 'warn':
          console.warn(formattedLog);
          break;
        case 'error':
          console.error(formattedLog);
          break;
      }
    } else {
      // In production, you might want to send logs to a service
      // Example: Sentry, LogRocket, DataDog, etc.
      console.error(formattedLog); // Always log errors to console in production
    }

    // Store logs for debugging (in development only)
    if (this.isDevelopment) {
      this.storeLog(entry);
    }
  }

  private storeLog(entry: LogEntry): void {
    if (typeof window !== 'undefined') {
      const logs = this.getStoredLogs();
      logs.push(entry);
      
      // Keep only last 1000 logs
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      localStorage.setItem('savdobot_logs', JSON.stringify(logs));
    }
  }

  private getStoredLogs(): LogEntry[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('savdobot_logs');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  }

  // Public logging methods
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  // Specialized logging methods
  api(method: string, url: string, status: number, duration?: number, context?: Record<string, unknown>): void {
    this.info(`API ${method} ${url}`, {
      status,
      duration: duration ? `${duration}ms` : undefined,
      ...context,
    });
  }

  database(operation: string, table: string, duration?: number, context?: Record<string, unknown>): void {
    this.debug(`DB ${operation} on ${table}`, {
      duration: duration ? `${duration}ms` : undefined,
      ...context,
    });
  }

  auth(action: string, userId?: string, context?: Record<string, unknown>): void {
    this.info(`Auth ${action}`, {
      userId,
      ...context,
    });
  }

  performance(operation: string, duration: number, context?: Record<string, unknown>): void {
    this.warn(`Performance: ${operation} took ${duration}ms`, context);
  }

  // Get stored logs for debugging
  getLogs(): LogEntry[] {
    return this.getStoredLogs();
  }

  // Clear stored logs
  clearLogs(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savdobot_logs');
    }
  }

  // Export logs for debugging
  exportLogs(): string {
    const logs = this.getStoredLogs();
    return JSON.stringify(logs, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export types for use in other files
export type { LogLevel, LogEntry };

// Development helper to access logs from console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).savdobotLogger = logger;
  console.log('Logger available at window.savdobotLogger');
}
