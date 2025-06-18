"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    // Get role from sessionStorage (demo only)
    const role = typeof window !== "undefined" ? sessionStorage.getItem("role") : null;
    let dashboardPath = "/dashboard";
    switch (role) {
      case "ADMIN":
        dashboardPath = "/admin";
        break;
      case "TEACHER":
        dashboardPath = "/teacher";
        break;
      case "PARENT":
        dashboardPath = "/parent";
        break;
      case "STUDENT":
        dashboardPath = "/student";
        break;
      default:
        dashboardPath = "/sign-in";
    }
    router.replace(dashboardPath);
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-lg text-gray-600">Redirecting to your dashboard...</span>
    </div>
  );
}
