import { AlertTriangle, Clock, RefreshCw, Wifi } from 'lucide-react';
import React from 'react';

interface ErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
  type?: 'network' | 'timeout' | 'server' | 'unknown';
  message?: string;
  showDetails?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  type = 'unknown',
  message,
  showDetails = false,
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: Wifi,
          title: 'Connection Error',
          message:
            message || 'Unable to connect to the server. Please check your internet connection.',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-700',
        };
      case 'timeout':
        return {
          icon: Clock,
          title: 'Request Timeout',
          message: message || 'The request took too long to complete. Please try again.',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-700',
        };
      case 'server':
        return {
          icon: AlertTriangle,
          title: 'Server Error',
          message: message || 'A server error occurred. Our team has been notified.',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-700',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Something went wrong',
          message: message || error?.message || 'An unexpected error occurred.',
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-700',
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 text-center`}>
      <div
        className={`w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className={`w-6 h-6 ${config.color}`} />
      </div>

      <h3 className={`text-lg font-semibold ${config.color} mb-2`}>{config.title}</h3>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{config.message}</p>

      {showDetails && error && (
        <details className="text-left mb-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            Show technical details
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-gray-800 dark:text-gray-200">
            {error.stack || error.message}
          </pre>
        </details>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'spinner' | 'pulse' | 'skeleton';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  type = 'spinner',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (type === 'skeleton') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className={`${sizeClasses[size]} animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mb-4`}
      ></div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
    </div>
  );
};

interface AsyncStateProps {
  loading: boolean;
  error: Error | null;
  onRetry?: () => void;
  loadingMessage?: string;
  errorType?: 'network' | 'timeout' | 'server' | 'unknown';
  children: React.ReactNode;
}

export const AsyncState: React.FC<AsyncStateProps> = ({
  loading,
  error,
  onRetry,
  loadingMessage,
  errorType,
  children,
}) => {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} type={errorType} />;
  }

  return <>{children}</>;
};
