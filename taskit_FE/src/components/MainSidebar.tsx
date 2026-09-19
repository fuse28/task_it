"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboardIcon, FolderKanbanIcon, LogOutIcon } from "lucide-react";
import API from "@/lib/interceptor";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Projects", href: "/projects", icon: FolderKanbanIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await API.post("/auth/logout", { refreshToken });
      }
    } catch {
      // proceed with local logout even if server call fails
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.replace("/auth");
    }
  }

  return (
    <div className="flex min-h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary">
          <span className="text-sm font-bold text-primary-foreground">T</span>
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">TaskIt</span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="size-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
