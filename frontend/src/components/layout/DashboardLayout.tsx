import { useState, type PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

interface DashboardLayoutProps {
  pageTitle: string;
}

export function DashboardLayout({ pageTitle, children }: PropsWithChildren<DashboardLayoutProps>) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex gap-4 p-4 max-w-[1600px] mx-auto">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 space-y-4">
        <TopNavbar pageTitle={pageTitle} onMobileMenuClick={() => setMobileOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}