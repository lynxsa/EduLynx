'use client';

import { AlertCircle, ArrowLeft, CheckCircle, GraduationCap, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const [form, setForm] = useState<ForgotPasswordForm>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(form.email)) return;

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmail = (email: string) => {
    setForm({ email });
    if (emailError) setEmailError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Reset link sent!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Check your email for a password reset link. If you don't see it, check your spam
                    folder.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Unable to send reset link</p>
                  <p className="text-red-700 text-sm mt-1">
                    Please check that your email address is correct and try again.
                  </p>
                </div>
              </div>
            )}

            {submitStatus !== 'success' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => updateEmail(e.target.value)}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email address"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                  {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending Reset Link...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Send Reset Link</span>
                    </div>
                  )}
                </Button>
              </form>
            )}

            <div className="text-center space-y-3">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </Link>

              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-purple-600 hover:underline font-medium">
                  Create one here
                </Link>
              </div>
            </div>

            {/* Demo Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium mb-2">💡 Demo Mode</p>
              <p className="text-blue-700 text-xs">
                Use the demo credentials on the{' '}
                <Link href="/auth/signin" className="underline">
                  login page
                </Link>{' '}
                to explore the platform without creating an account.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
