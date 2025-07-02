// Global Error Boundary and Error Handling Utilities
'use client';

import { AlertTriangle, Bug, Home, RefreshCw } from 'lucide-react';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to monitoring service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, replace with your error monitoring service
      console.error('Error Report:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const errorDetails = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      timestamp: new Date().toISOString(),
    };

    const mailto = `mailto:support@edulynx.co.za?subject=Bug Report&body=${encodeURIComponent(
      `Error Details:\n${JSON.stringify(errorDetails, null, 2)}`
    )}`;

    window.open(mailto);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>

            <p className="text-gray-600 mb-8 text-lg">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {/* Error Details (for development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                <p className="text-red-600 text-sm font-mono mb-2">{this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </button>

              <button
                onClick={this.handleReportBug}
                className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Bug className="w-5 h-5 mr-2" />
                Report Bug
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact our support team at{' '}
                <a href="mailto:support@edulynx.co.za" className="text-purple-600 hover:underline">
                  support@edulynx.co.za
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Async error captured:', error);
    setError(error);
  }, []);

  // Throw error to be caught by Error Boundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
}

// Network error handler
export class NetworkError extends Error {
  public status?: number;
  public statusText?: string;

  constructor(message: string, status?: number, statusText?: string) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
    this.statusText = statusText;
  }
}

// API error handler utility
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  errorMessage = 'An error occurred'
): Promise<T> {
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    if (error instanceof Response) {
      throw new NetworkError(
        `${errorMessage}: ${error.statusText}`,
        error.status,
        error.statusText
      );
    }

    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`);
    }

    throw new Error(errorMessage);
  }
}

// Loading error component
export function LoadingError({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
      <p className="text-gray-600 mb-4">
        {message || 'Something went wrong while loading this content.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}

// Form error handler
export function FormError({ error }: { error?: string | string[] }) {
  if (!error) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          {errors.map((err, index) => (
            <p key={index} className="text-red-700 text-sm">
              {err}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Success message component
export function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-green-700 text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
