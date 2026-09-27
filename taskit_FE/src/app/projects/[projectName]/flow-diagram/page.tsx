"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useProject } from "../hooks/useProject";
import { useFlowDiagrams } from "./hooks/useFlowDiagrams";
import { CreateFlowDiagramModal } from "./components/CreateFlowDiagramModal";
import { WorkflowIcon, PlusIcon } from "lucide-react";

export default function FlowDiagramListPage() {
  const isAuthenticated = useRequireAuth();
  const router = useRouter();
  const { projectName } = useParams<{ projectName: string }>();
  const { data: project, isLoading: projectLoading } = useProject(projectName);
  const { data: diagrams = [], isLoading: diagramsLoading } = useFlowDiagrams(
    project?.id ?? 0
  );
  const [createOpen, setCreateOpen] = useState(false);

  if (!isAuthenticated) return null;

  const isLoading = projectLoading || (!!project && diagramsLoading);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Flow Diagrams"
          description="Create and manage process flow diagrams for this project"
          actions={
            project && (
              <Button onClick={() => setCreateOpen(true)}>
                <PlusIcon className="size-4" />
                New Flow Diagram
              </Button>
            )
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : diagrams.length === 0 ? (
          <EmptyState
            icon={WorkflowIcon}
            title="No flow diagrams yet"
            description="Create your first flow diagram to map out a process."
            action={
              project && (
                <Button onClick={() => setCreateOpen(true)}>New Flow Diagram</Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diagrams.map((diagram) => (
              <Card
                key={diagram.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() =>
                  router.push(`/projects/${projectName}/flow-diagram/${diagram.id}`)
                }
              >
                <CardContent className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <WorkflowIcon className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-foreground">{diagram.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(diagram.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {project && (
          <CreateFlowDiagramModal
            open={createOpen}
            onOpenChange={setCreateOpen}
            currentProjectId={project.id}
          />
        )}
      </div>
    </MainLayout>
  );
}
