"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Activity,
  FolderGit2,
  GitPullRequest,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  ShieldCheck,
  Target,
  PlayCircle,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: FolderGit2,
    href: "/repositories",
  },
  {
    label: "Accessibility Runs",
    icon: ShieldCheck,
    href: "/scans",
  },
  {
    label: "Accessibility Repairs",
    icon: Target,
    href: "/issues",
  },
  {
    label: "AI Pull Requests",
    icon: GitPullRequest,
    href: "/pull-requests",
  },
  {
    label: "Agents",
    icon: Activity,
    href: "/agents",
  },
  {
    label: "Insights",
    icon: LayoutDashboard, // I'll change this to LineChart if imported, otherwise keep LayoutDashboard
    href: "/insights",
  },
  {
    label: "Interactive Demo",
    icon: PlayCircle,
    href: "/demo",
  },
];

const bottomRoutes = [
  {
    label: "Support",
    icon: LifeBuoy,
    href: "/support",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight">Flex Pilot</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname.startsWith(route.href) ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <nav className="grid gap-1 text-sm font-medium">
          {bottomRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === route.href ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
