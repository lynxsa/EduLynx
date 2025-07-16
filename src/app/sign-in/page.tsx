'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/styles/theme';
import {
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  LogIn,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import EduLynxLogo from '../../components/EduLynxLogo';
import StandardLoadingScreen from '../../components/StandardLoadingScreen';

// Demo credentials for quick login - Updated with South African database
const demoCredentials = [
  {
    title: 'Admin',
    email: 'admin@lynxacademy.co.za',
    password: 'admin123',
    icon: ShieldCheck,
    description: 'Derah Manyelo - System Admin',
    gradient: 'from-purple-500 to-indigo-600',
  },
  {
    title: 'Teacher',
    email: 'nomsa.dlamini@lynxacademy.co.za',
    password: 'teacher123',
    icon: GraduationCap,
    description: 'Nomsa Dlamini - Mathematics',
    gradient: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'Parent',
    email: 'amy.singh.0@gmail.com',
    password: 'parent123',
    icon: Users,
    description: 'Amy Singh - Parent',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    title: 'Student',
    email: 'johann.singh.8a.0@student.lynxacademy.co.za',
    password: 'student123',
    icon: UserCheck,
    description: 'Johann Singh - Grade 8A',
    gradient: 'from-orange-500 to-red-600',
  },
];

// Fancy loading spinner component
const FancyLoader = () => (
  <div className="relative">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white/60 rounded-full animate-spin animate-reverse"></div>
  </div>
);

// Success animation component
const SuccessAnimation = () => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="w-5 h-5 text-green-400 animate-bounce" />
    <span className="text-green-400 font-medium">Success!</span>
  </div>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { login, isAuthenticated, isLoading, user } = useAuth();
  const { theme, setTheme, actualTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      const redirectPath =
        user.role === 'ADMIN'
          ? '/admin'
          : user.role === 'TEACHER'
            ? '/teacher'
            : user.role === 'PARENT'
              ? '/parent'
              : user.role === 'STUDENT'
                ? '/student'
                : '/dashboard';
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    console.log('🚀 Sign-in attempt started', {
      email,
      passwordLength: password.length,
    });

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        console.log('✅ Login successful, redirecting...');
        setSuccess(true);
        // Don't redirect here - let the useEffect handle it after user state updates
      } else {
        console.error('❌ Login failed:', result.error);
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Show loading spinner if auth is still loading
  if (isLoading) {
    return <StandardLoadingScreen message="Loading EduLynx..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Theme Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center bg-white/20 dark:bg-slate-800/20 backdrop-blur-md rounded-lg p-1 border border-white/30 dark:border-slate-700/30">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-md transition-all ${
              theme === 'light'
                ? 'bg-white/80 shadow-sm text-amber-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
            }`}
            title="Light mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-md transition-all ${
              theme === 'dark'
                ? 'bg-slate-700/80 shadow-sm text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-blue-400'
            }`}
            title="Dark mode"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-2 rounded-md transition-all ${
              theme === 'system'
                ? 'bg-white/80 dark:bg-slate-700/80 shadow-sm text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500'
            }`}
            title="System preference"
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card with Glassmorphism Effect */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl shadow-lg mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl blur opacity-50"></div>
              <EduLynxLogo
                width={32}
                height={32}
                className="text-white relative z-10"
                forceWhiteLogo={true}
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-500 bg-clip-text text-transparent mb-3">
              Welcome to EduLynx
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Sign in to your account to continue your educational journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white/70 dark:hover:bg-slate-700/70"
                placeholder="Enter your email address"
                disabled={loading}
              />
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white/70 dark:hover:bg-slate-700/70"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg p-4 animate-fadeIn">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-lg p-4 animate-fadeIn">
                <SuccessAnimation />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <FancyLoader />
              ) : success ? (
                <SuccessAnimation />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-medium backdrop-blur-sm">
                  Quick Demo Access
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {demoCredentials.map(account => {
                const IconComponent = account.icon;
                return (
                  <button
                    key={account.title}
                    type="button"
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={loading}
                    className={`p-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg transition-all duration-200 text-left group bg-gradient-to-r ${account.gradient} text-white hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-semibold text-sm">{account.title}</span>
                    </div>
                    <p className="text-xs opacity-90 leading-tight">{account.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Click any card above to auto-fill credentials
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by{' '}
            <span className="font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LYNX Consulting
            </span>{' '}
            South Africa
          </p>
        </div>
      </div>
    </div>
  );
}
