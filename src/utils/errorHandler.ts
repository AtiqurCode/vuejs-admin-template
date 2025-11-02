import { Notify } from 'quasar'

export interface ErrorHandlerOptions {
  userMessage?: string
  logError?: boolean
  showNotification?: boolean
}

/**
 * Centralized error handler for the application
 * Handles errors consistently and provides user-friendly messages
 */
export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): string => {
  const {
    userMessage,
    logError = true,
    showNotification = true
  } = options

  // Extract error message
  let errorMessage = 'An unexpected error occurred'
  
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as { message: unknown }).message)
  }

  // Log error (only in development or if explicitly enabled)
  if (logError && import.meta.env.DEV) {
    console.error('❌ Error:', error)
    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error)
  }

  // Show user-friendly notification
  if (showNotification) {
    Notify.create({
      type: 'negative',
      message: userMessage || errorMessage,
      icon: 'error',
      position: 'top',
      timeout: 5000
    })
  }

  return userMessage || errorMessage
}

/**
 * Handle API errors specifically
 */
export const handleApiError = (error: unknown, defaultMessage = 'Failed to fetch data') => {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as { message: string; code?: string }
    return handleError(error, {
      userMessage: apiError.message || defaultMessage,
      showNotification: true
    })
  }
  
  return handleError(error, {
    userMessage: defaultMessage,
    showNotification: true
  })
}

