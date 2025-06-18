import ProfLynxAssistant from '@/components/ProfLynxAssistant';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* ...existing navbar/sidebar... */}
      {children}
      <ProfLynxAssistant />
    </div>
  );
}