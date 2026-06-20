"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Compass,
  User,
  Bell,
  FileText,
  Users,
  Sparkles,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
    },
    {
      label: "Teams",
      href: "/teams",
      icon: Users,
    },
    {
      label: "Notes",
      href: "/notes",
      icon: FileText,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-[#09090B]/95 p-5 text-white backdrop-blur-xl">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-600/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        <div>
          <h1 className="text-xl font-black tracking-tight">
            CampusHub
          </h1>

          <p className="text-xs text-zinc-500">
            Student workspace
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const isActive =
            pathname === link.href ||
            pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-violet-600/15 text-violet-300 shadow-inner shadow-violet-500/10"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.04] text-zinc-400 group-hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              <span>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          CampusHub
        </p>

        <p className="mt-2 text-sm text-zinc-300">
          Build. Collaborate. Ship.
        </p>
      </div>
    </aside>
  );
}