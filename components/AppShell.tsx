"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import LogoutButton from "@/components/LogoutButton";
import NotificationBell from "@/components/NotificationBell";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/about",
  ];

  const isPublicPage =
    publicPages.includes(pathname);

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div>
      <Sidebar />

      <main className="ml-64 min-h-screen">
        <div className="flex justify-end border-b border-white/10 p-4">
          <div className="flex items-center gap-6">
            <NotificationBell />
            <LogoutButton />
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}