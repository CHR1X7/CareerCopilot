import Sidebar from '@/components/dashboard/Sidebar';
import DashboardAuthGuard from '@/components/dashboard/DashboardAuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen overflow-hidden ambient-bg">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
        </main>

        {/* Floating orbs */}
        <div className="orb orb-purple w-[500px] h-[500px] top-[-10%] right-[10%]" />
        <div className="orb orb-blue w-[400px] h-[400px] bottom-[10%] left-[20%]" style={{ animationDelay: '-7s' }} />
        <div className="orb orb-emerald w-[300px] h-[300px] top-[40%] right-[30%]" style={{ animationDelay: '-14s' }} />
      </div>
    </DashboardAuthGuard>
  );
}