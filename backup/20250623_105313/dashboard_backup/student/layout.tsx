import ProfLynxAssistant from '@/components/ProfLynxAssistant';

// ...existing code...

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  // ...existing code...
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* ...existing navbar/sidebar... */}
      {children}
      <ProfLynxAssistant />
    </div>
  );
}

// ...existing code...
