"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CustomLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Clear any existing auth data on page load
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userEmail");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    console.log('🚀 Sign-in attempt started', { email, passwordLength: password.length });
    
    // Client-side validation
    if (!email.trim() && !password.trim()) {
      const errorMsg = "Email is required. Password is required.";
      console.log('❌ Validation error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }
    if (!email.trim()) {
      const errorMsg = "Email is required";
      console.log('❌ Validation error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      const errorMsg = "Password is required";
      console.log('❌ Validation error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const errorMsg = "Please enter a valid email address";
      console.log('❌ Email validation error:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      return;
    }
    
    try {
      console.log('📡 Making API request to /api/auth/login');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password: password.trim()
        }),
        credentials: 'include'
      });

      console.log('📡 API response status:', response.status);
      
      if (!response.ok) {
        console.log('❌ API response not ok:', response.status, response.statusText);
      }

      const data = await response.json();
      console.log('📡 API response data:', { 
        success: data.success, 
        hasUser: !!data.user, 
        redirectTo: data.redirectTo,
        error: data.error 
      });

      if (response.ok && data.success) {
        // Store user info in sessionStorage for immediate use
        if (typeof window !== 'undefined') {
          sessionStorage.setItem("role", data.user.role);
          sessionStorage.setItem("userId", data.user.id);
          sessionStorage.setItem("userEmail", data.user.email);
          sessionStorage.setItem("userName", data.user.fullName);
          console.log('💾 Stored user data in sessionStorage');
        }
        
        console.log(`✅ Login successful: ${data.user.fullName} (${data.user.role})`);
        console.log('🚀 Redirecting to:', data.redirectTo);
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Redirect to role-specific dashboard
        window.location.href = data.redirectTo; // Use window.location for more reliable redirect
      } else {
        const errorMsg = data.error || data.message || 'Invalid credentials';
        console.log('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill demo credentials for development
  const fillDemoCredentials = (role: string) => {
    const credentials = {
      admin: { email: 'admin@lynxacademy.co.za', password: 'adminpass' },
      teacher: { email: 'teacher1@lynxacademy.co.za', password: 'teacherpass' },
      parent: { email: 'parent1@lynxacademy.co.za', password: 'parentpass' },
      student: { email: 'student1@lynxacademy.co.za', password: 'studentpass' }
    }[role];
    
    if (credentials) {
      setEmail(credentials.email);
      setPassword(credentials.password);
      setError("");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden p-4"
      style={{
        background: `
          linear-gradient(135deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #c084fc 75%, #ddd6fe 100%),
          radial-gradient(circle at 20% 80%, #ddd6fe 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #c084fc 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, #a855f7 0%, transparent 50%)
        `
      }}
    >
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl p-6 w-full flex flex-col items-center border border-white/20"
          autoComplete="off"
        >
          <div className="mb-6 text-center">
            <div className="mb-3 flex justify-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-lg">
                <Image 
                  src="/logo.png" 
                  alt="EduLynx Logo" 
                  width={64} 
                  height={64} 
                  className="object-contain"
                  priority
                  onLoad={() => console.log('Logo loaded successfully')}
                  onError={(e) => {
                    console.error('Logo failed to load from /logo.png');
                    // Keep the purple background, no fallback text
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-purple-700">EduLynx</h1>
            <p className="text-sm text-gray-600 mt-1">School Management Platform</p>
          </div>
          <div className="w-full mb-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="w-full mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div className="mb-3 text-red-700 bg-red-50 border border-red-200 rounded-lg p-2 w-full text-center text-sm">
              {error.split('. ').map((msg, idx) => (
                <div key={idx}>{msg.trim()}</div>
              ))}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          
          <div className="mt-4 w-full text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-700 mb-2 text-center text-xs">Demo Accounts (Click to auto-fill):</div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="text-left p-1.5 hover:bg-blue-50 rounded border transition-colors"
              >
                <div className="font-medium text-blue-700 text-xs">Admin</div>
                <div className="text-xs text-gray-500 truncate">admin@lynxacademy.co.za</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('teacher')}
                className="text-left p-1.5 hover:bg-green-50 rounded border transition-colors"
              >
                <div className="font-medium text-green-700 text-xs">Teacher</div>
                <div className="text-xs text-gray-500 truncate">teacher1@lynxacademy.co.za</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('parent')}
                className="text-left p-1.5 hover:bg-purple-50 rounded border transition-colors"
              >
                <div className="font-medium text-purple-700 text-xs">Parent</div>
                <div className="text-xs text-gray-500 truncate">parent1@lynxacademy.co.za</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('student')}
                className="text-left p-1.5 hover:bg-orange-50 rounded border transition-colors"
              >
                <div className="font-medium text-orange-700 text-xs">Student</div>
                <div className="text-xs text-gray-500 truncate">student1@lynxacademy.co.za</div>
              </button>
            </div>
          </div>
        </form>
        
        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/80">
            Developed by LYNX Consulting South Africa (Pty) Ltd
          </p>
        </div>
      </div>
    </div>
  );
}