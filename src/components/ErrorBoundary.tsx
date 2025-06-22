'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  level?: 'page' | 'component' | 'critical';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorId: string;
}

// Enhanced error logging service
class ErrorLogger {
  static log(error: Error, errorInfo: React.ErrorInfo, level: string, errorId: string) {
    const errorReport = {
      errorId,
      timestamp: new Date().toISOString(),
      level,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${level}]`);
      console.error('Error ID:', errorId);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Full Report:', errorReport);
      console.groupEnd();
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(() => {
        // Fallback: store in localStorage for later retry
        const errors = JSON.parse(localStorage.getItem('errorQueue') || '[]');
        errors.push(errorReport);
        localStorage.setItem('errorQueue', JSON.stringify(errors.slice(-10))); // Keep last 10
      });
    }
  }
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorId: string;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.errorId = '';
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const level = this.props.level || 'component';
    const errorId = this.state.errorId;

    // Log the error
    ErrorLogger.log(error, errorInfo, level, errorId);

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const level = this.props.level || 'component';

      // Critical errors get full-page treatment
      if (level === 'critical') {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Critical Error
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                A critical error occurred. The application needs to be restarted.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
                Error ID: {errorId}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Restart Application
              </button>
            </div>
          </div>
        );
      }

      // Page-level errors
      if (level === 'page') {
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Page Error
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This page encountered an error. You can try refreshing or return to the dashboard.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {error?.message || 'Unknown error'}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <Home className="w-4 h-4 inline mr-2" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Component-level errors (default)
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 m-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Component Error
              </h3>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
                This component failed to render properly.
              </p>
              <button
                onClick={this.handleRetry}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded font-medium transition-colors"
              >
                <RefreshCw className="w-3 h-3 inline mr-1" />
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
