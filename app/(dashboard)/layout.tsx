import Sidebar from '@/components/dashboard/Sidebar';
import DashboardAuthGuard from '@/components/dashboard/DashboardAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen bg-gray-950 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </DashboardAuthGuard>
  );
}