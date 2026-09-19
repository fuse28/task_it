"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ArrowLeftIcon, KanbanSquareIcon, WorkflowIcon, PencilRulerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectSidebar() {
  const pathname = usePathname();
  const { projectName } = useParams<{ projectName: string }>();

  const links = [
    { name: "Tasks", href: `/projects/${projectName}/tasks`, icon: KanbanSquareIcon },
    { name: "Flow Diagram", href: `/projects/${projectName}/flow-diagram`, icon: WorkflowIcon },
    { name: "Drawing Board", href: `/projects/${projectName}/drawing-board`, icon: PencilRulerIcon },
  ];

  return (
    <div className="flex min-h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
      <Link
        href="/projects"
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        All projects
      </Link>

      <h2 className="mb-4 truncate text-lg font-bold text-sidebar-foreground" title={decodeURIComponent(projectName ?? "")}>
        {decodeURIComponent(projectName ?? "")}
      </h2>

      <ul className="space-y-1">
        {links.map((item) => {
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
                <Icon className="size-4" />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
