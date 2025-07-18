'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, Eye, EyeOff, GraduationCap, ShieldCheck, UserCheck } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SigninData = z.infer<typeof signinSchema>;

// Demo credentials for quick login
const demoCredentials = [
  {
    title: 'Admin',
    email: 'admin@lynxlearn.co.za',
    password: 'admin123',
    icon: ShieldCheck,
    description: 'System Administrator',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Teacher',
    email: 'teacher@lynxlearn.co.za',
    password: 'teacher123',
    icon: GraduationCap,
    description: 'Course Instructor',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Student',
    email: 'student@lynxlearn.co.za',
    password: 'student123',
    icon: UserCheck,
    description: 'Student Account',
    gradient: 'from-green-500 to-emerald-600',
  },
];

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SigninData>({
    resolver: zodResolver(signinSchema),
  });

  // Check for error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const errorMsg = urlParams.get('message');

    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          setErrorMsg(
            errorMsg || 'Invalid email or password. Please check your credentials and try again.'
          );
          break;
        case 'Configuration':
          setErrorMsg('There is a problem with the server configuration. Please try again later.');
          break;
        case 'AccessDenied':
          setErrorMsg('You do not have permission to access this resource.');
          break;
        case 'Verification':
          setErrorMsg('The verification link has expired or is invalid.');
          break;
        default:
          setErrorMsg(
            errorMsg || 'An unexpected error occurred during authentication. Please try again.'
          );
      }
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const onSubmit = async (data: SigninData) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      console.log('Attempting sign in with:', data.email);
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);

        // Handle specific error types
        switch (result.error) {
          case 'CredentialsSignin':
            setErrorMsg('Invalid email or password. Please check your credentials and try again.');
            break;
          case 'Configuration':
            setErrorMsg(
              'There is a problem with the server configuration. Please contact support.'
            );
            break;
          default:
            setErrorMsg('Authentication failed. Please try again.');
        }
      } else if (result?.ok) {
        console.log('Sign in successful');
        setShowSuccess(true);
        // Add a delay to show success message before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Sign in exception:', error);
      setErrorMsg('A network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (credentials: (typeof demoCredentials)[0]) => {
    setValue('email', credentials.email);
    setValue('password', credentials.password);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Main Sign In Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent mb-3">
              LynxLearn LMS
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Sign in to access your learning dashboard
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
              Quick Demo Login:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(cred)}
                  className={`p-3 rounded-lg bg-gradient-to-r ${cred.gradient} text-white text-xs font-medium hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}
                >
                  <cred.icon className="h-4 w-4" />
                  <span>{cred.title}</span>
                  <span className="text-xs opacity-80">({cred.description})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {errorMsg && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {showSuccess ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Success! Redirecting...</span>
                </>
              ) : isLoading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
