import Sidebar from '@/components/dashboard/Sidebar';
import DashboardAuthGuard from '@/components/dashboard/DashboardAuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardAuthGuard>
      <div className="flex h-screen overflow-hidden warm-bg">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
        </main>
        {/* Ambient blobs */}
        <div className="blob blob-purple w-[500px] h-[500px] -top-[10%] right-[5%]" />
        <div className="blob blob-orange w-[400px] h-[400px] bottom-[5%] left-[15%]" style={{ animationDelay: '-8s' }} />
        <div className="blob blob-blue w-[300px] h-[300px] top-[40%] right-[25%]" style={{ animationDelay: '-16s' }} />
        <div className="blob blob-green w-[350px] h-[350px] top-[20%] left-[5%]" style={{ animationDelay: '-12s' }} />
      </div>
    </DashboardAuthGuard>
  );
}