"use client";

import { useMemo, useState } from "react";
import MainLayout from "../../components/MainLayout";
import CreateProjectModal from "@/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { useAllProjects } from "./hooks/project";
import ProjectList from "./components/projectList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { FolderKanbanIcon, PlusIcon, SearchIcon } from "lucide-react";

export default function ProjectsPage() {
  const isAuthenticated = useRequireAuth();
  const [createProjectVisible, setCreateProjectVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { data: projectListData = [], isLoading } = useAllProjects(isAuthenticated);

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projectListData;
    const query = search.trim().toLowerCase();
    return projectListData.filter((project: { name?: string }) =>
      project.name?.toLowerCase().includes(query)
    );
  }, [projectListData, search]);

  if (!isAuthenticated) return null;

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          title="Projects"
          description="Manage your projects and tasks"
          actions={
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 sm:w-64"
              />
            </div>
          }
        />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {isLoading ? "Loading..." : `${filteredProjects.length} Project${filteredProjects.length === 1 ? "" : "s"}`}
          </h2>
          {projectListData.length > 0 && (
            <Button onClick={() => setCreateProjectVisible(true)}>
              <PlusIcon className="size-4" />
              Create New Project
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : projectListData.length > 0 ? (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ProjectList projectListData={filteredProjects} />
            </div>
          ) : (
            <EmptyState
              icon={SearchIcon}
              title="No matching projects"
              description={`No projects found for "${search}".`}
            />
          )
        ) : (
          <EmptyState
            icon={FolderKanbanIcon}
            title="No projects yet"
            description="Create your first project to start organizing tasks."
            action={
              <Button onClick={() => setCreateProjectVisible(true)}>
                <PlusIcon className="size-4" />
                Create New Project
              </Button>
            }
          />
        )}

        <CreateProjectModal
          visible={createProjectVisible}
          setVisible={(visible) => setCreateProjectVisible(visible)}
        />
      </div>
    </MainLayout>
  );
}
