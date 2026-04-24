import Sidebar from '@/components/dashboard/Sidebar';
import DashboardAuthGuard from '@/components/dashboard/DashboardAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen bg-surface-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </DashboardAuthGuard>
  );
}