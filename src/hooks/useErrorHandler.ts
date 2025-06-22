import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

interface ErrorDetails {
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: string;
  url: string;
  userAgent: string;
}

interface UseErrorHandlerOptions {
  enableGlobalHandler?: boolean;
  enableUnhandledRejection?: boolean;
  onError?: (error: ErrorDetails) => void;
  redirectOnCritical?: string;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const router = useRouter();
  const {
    enableGlobalHandler = true,
    enableUnhandledRejection = true,
    onError,
    redirectOnCritical,
  } = options;

  // Global error handler
  const handleGlobalError = useCallback(
    (event: ErrorEvent) => {
      const errorDetails: ErrorDetails = {
        message: event.message,
        stack: event.error?.stack,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      console.error('🚨 Global Error:', errorDetails);

      // Call custom error handler
      onError?.(errorDetails);

      // Log to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/errors/global', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorDetails),
        }).catch(() => {
          // Store for retry
          const errors = JSON.parse(localStorage.getItem('globalErrorQueue') || '[]');
          errors.push(errorDetails);
          localStorage.setItem('globalErrorQueue', JSON.stringify(errors.slice(-5)));
        });
      }

      // Redirect on critical errors
      if (
        redirectOnCritical &&
        (event.error?.name === 'ChunkLoadError' || event.message.includes('Loading chunk'))
      ) {
        setTimeout(() => {
          router.push(redirectOnCritical);
        }, 1000);
      }
    },
    [onError, redirectOnCritical, router]
  );

  // Unhandled promise rejection handler
  const handleUnhandledRejection = useCallback(
    (event: PromiseRejectionEvent) => {
      const errorDetails: ErrorDetails = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      console.error('🚨 Unhandled Rejection:', errorDetails);

      onError?.(errorDetails);

      // Prevent default browser behavior
      event.preventDefault();

      // Log to monitoring service
      if (process.env.NODE_ENV === 'production') {
        fetch('/api/errors/rejection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorDetails),
        }).catch(() => {
          const errors = JSON.parse(localStorage.getItem('rejectionErrorQueue') || '[]');
          errors.push(errorDetails);
          localStorage.setItem('rejectionErrorQueue', JSON.stringify(errors.slice(-5)));
        });
      }
    },
    [onError]
  );

  // Set up global error handlers
  useEffect(() => {
    if (enableGlobalHandler) {
      window.addEventListener('error', handleGlobalError);
    }

    if (enableUnhandledRejection) {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
    }

    return () => {
      if (enableGlobalHandler) {
        window.removeEventListener('error', handleGlobalError);
      }
      if (enableUnhandledRejection) {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      }
    };
  }, [enableGlobalHandler, enableUnhandledRejection, handleGlobalError, handleUnhandledRejection]);

  // Manual error reporting function
  const reportError = useCallback(
    (error: Error, context?: string) => {
      const errorDetails: ErrorDetails = {
        message: error.message,
        stack: error.stack,
        source: context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      console.error('🚨 Manual Error Report:', errorDetails);
      onError?.(errorDetails);

      if (process.env.NODE_ENV === 'production') {
        fetch('/api/errors/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...errorDetails, context }),
        }).catch(() => {
          const errors = JSON.parse(localStorage.getItem('manualErrorQueue') || '[]');
          errors.push(errorDetails);
          localStorage.setItem('manualErrorQueue', JSON.stringify(errors.slice(-5)));
        });
      }
    },
    [onError]
  );

  return { reportError };
};

// Utility functions for error handling
export const errorUtils = {
  // Check if error is network-related
  isNetworkError: (error: Error): boolean => {
    return (
      error.message.toLowerCase().includes('network') ||
      error.message.toLowerCase().includes('fetch') ||
      error.name === 'NetworkError'
    );
  },

  // Check if error is chunk loading error
  isChunkError: (error: Error): boolean => {
    return (
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk')
    );
  },

  // Check if error is authentication-related
  isAuthError: (error: Error): boolean => {
    return (
      error.message.toLowerCase().includes('unauthorized') ||
      error.message.toLowerCase().includes('authentication') ||
      error.message.includes('401')
    );
  },

  // Get user-friendly error message
  getUserFriendlyMessage: (error: Error): string => {
    if (errorUtils.isNetworkError(error)) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    if (errorUtils.isChunkError(error)) {
      return 'Application update detected. Please refresh the page to continue.';
    }
    if (errorUtils.isAuthError(error)) {
      return 'Authentication required. Please sign in to continue.';
    }
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  },

  // Retry function with exponential backoff
  retryWithBackoff: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  },
};
