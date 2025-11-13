/**
 * Logger utility for consistent logging across the application
 * Replace console.* calls with this logger for better control
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private serviceName = 'hmobility-safe-streets';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${this.serviceName}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private sendToExternalService(level: LogLevel, message: string, context?: LogContext) {
    // TODO: Integrate with external logging service (Sentry, LogRocket, DataDog, etc.)
    // Example:
    // if (level === 'error') {
    //   Sentry.captureException(new Error(message), { extra: context });
    // }
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.info(this.formatMessage('info', message, context));
    this.sendToExternalService('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
    this.sendToExternalService('warn', message, context);
  }

  error(message: string, context?: LogContext, error?: Error) {
    const fullContext = error ? { ...context, error: error.message, stack: error.stack } : context;
    console.error(this.formatMessage('error', message, fullContext));
    this.sendToExternalService('error', message, fullContext);
  }

  /**
   * Log API errors with request/response details
   */
  apiError(message: string, details: { url: string; method: string; status?: number; error?: any }) {
    this.error(`API Error: ${message}`, details);
  }
}

export const logger = new Logger();
