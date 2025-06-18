"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

const Homepage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to sign-in after splash
    const timer = setTimeout(() => {
      router.push('/sign-in');
    }, 1200); // 1.2s splash
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-LYNXPurple to-LYNXLight">
      <Image src="/logo.png" alt="EduLynx Logo" width={80} height={80} className="mb-6 animate-bounce" priority />
      <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome to EduLynx</h1>
      <p className="text-lg text-white/80 mb-4">South Africa’s Premier School Management Platform</p>
      <span className="loader"></span>
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3726a6;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Homepage;