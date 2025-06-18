import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import ProfLynx from "@/components/ProfLynx";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Replace with real user context/session
  const userName = "Derah Manyelo";
  const userRole = "Admin";
  const avatarUrl = "/avatar.png";

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 lg:w-64 xl:w-72 flex-shrink-0 flex flex-col py-6 px-4 border-r border-gray-200 min-h-screen bg-white">
        <Link href="/" className="flex items-center justify-center gap-3 mb-6 px-2">
          <Image src="/logo.png" alt="EduLynx" width={40} height={40} className="rounded-lg" />
          <span className="hidden lg:block font-bold text-purple-600 text-xl tracking-tight">EduLynx</span>
        </Link>
        
        <div className="flex-1 overflow-y-auto">
          <Menu />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Enhanced Navbar */}
        <Navbar userName={userName} userRole={userRole} avatarUrl={avatarUrl} />
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </div>
      </main>

      {/* Prof Lynx AI Assistant */}
      <ProfLynx userRole={userRole} userName={userName} />
    </div>
  );
}

