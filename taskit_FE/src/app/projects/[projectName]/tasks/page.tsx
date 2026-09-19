"use client";

import { useParams } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useProject } from "../hooks/useProject";
import Board from "./components/Board";
import { FolderXIcon } from "lucide-react";

export default function TaskPage() {
  const isAuthenticated = useRequireAuth();
  const { projectName } = useParams<{ projectName: string }>();
  const { data: project, isLoading, isError } = useProject(projectName);

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={project?.name ?? decodeURIComponent(projectName ?? "")}
          description={project?.description || "Task board"}
        />

        {isLoading ? (
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-64 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : isError || !project ? (
          <EmptyState
            icon={FolderXIcon}
            title="Project not found"
            description="We couldn't load this project. It may have been deleted or renamed."
          />
        ) : (
          <Board projectId={project.id} team={project.team ?? []} />
        )}
      </div>
    </MainLayout>
  );
}
