'use client';

import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');

    console.log('Auth error page - Error:', errorParam, 'Message:', messageParam);

    switch (errorParam) {
      case 'CredentialsSignin':
        setError(
          messageParam || 'Invalid email or password. Please check your credentials and try again.'
        );
        break;
      case 'Configuration':
        setError('There is a problem with the server configuration. Please try again later.');
        break;
      case 'AccessDenied':
        setError('You do not have permission to access this resource.');
        break;
      case 'Verification':
        setError('The verification link has expired or is invalid.');
        break;
      default:
        setError(
          messageParam || 'An unexpected error occurred during authentication. Please try again.'
        );
    }

    // Auto redirect to signin page after 5 seconds
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/auth/signin');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [searchParams, router]);

  const handleRetry = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Error Icon */}
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We encountered an issue while signing you in
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400 text-sm text-center">{error}</p>
            {countdown > 0 && (
              <p className="text-red-600 dark:text-red-500 text-xs text-center mt-2">
                Redirecting to sign in page in {countdown} seconds...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Debug Info in Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                Error Code: {searchParams.get('error') || 'Unknown'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                URL: {window.location.href}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
