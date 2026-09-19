"use client";

import MainLayout from "../../components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAllProjects } from "../projects/hooks/project";
import { FolderKanbanIcon, UsersIcon } from "lucide-react";

export default function Dashboard() {
  const isAuthenticated = useRequireAuth();
  const { data: projects = [], isLoading } = useAllProjects(isAuthenticated);
  if (!isAuthenticated) return null;

  const teamMemberCount = new Set(
    projects.flatMap((project: { team?: { id: string }[] }) =>
      (project.team ?? []).map((member) => member.id)
    )
  ).size;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Welcome to your TaskIt dashboard" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-[92px] rounded-xl" />
            ))
          ) : (
            <>
              <StatCard label="Total Projects" value={projects.length} icon={FolderKanbanIcon} />
              <StatCard label="Team Members" value={teamMemberCount} icon={UsersIcon} />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
