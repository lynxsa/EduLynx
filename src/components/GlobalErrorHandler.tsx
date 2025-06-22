'use client';

import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useEffect } from 'react';

export const GlobalErrorHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { reportError } = useErrorHandler({
    enableGlobalHandler: true,
    enableUnhandledRejection: true,
    redirectOnCritical: '/',
    onError: error => {
      // Custom error handling logic
      console.log('Global error captured:', error);

      // Show user notification for network errors
      if (
        error.message.toLowerCase().includes('network') ||
        error.message.toLowerCase().includes('fetch')
      ) {
        // You could show a toast notification here
        console.warn('Network error detected - user should be notified');
      }
    },
  });

  // Report any initial errors from localStorage queue
  useEffect(() => {
    const retryQueuedErrors = async () => {
      const queues = ['errorQueue', 'globalErrorQueue', 'rejectionErrorQueue', 'manualErrorQueue'];

      for (const queueName of queues) {
        try {
          const queuedErrors = JSON.parse(localStorage.getItem(queueName) || '[]');

          if (queuedErrors.length > 0) {
            // Try to send queued errors
            for (const error of queuedErrors) {
              try {
                await fetch('/api/errors/retry', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...error, retried: true }),
                });
              } catch (retryError) {
                console.warn('Failed to retry error:', retryError);
              }
            }

            // Clear the queue after successful retry
            localStorage.removeItem(queueName);
          }
        } catch (error) {
          console.warn(`Failed to process ${queueName}:`, error);
        }
      }
    };

    // Retry queued errors after a short delay
    const timeoutId = setTimeout(retryQueuedErrors, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return <>{children}</>;
};
