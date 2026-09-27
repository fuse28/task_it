"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InlineEditableText } from "@/components/InlineEditableText";
import { useUpdateProject } from "@/app/projects/hooks/project";
import { slugify } from "@/lib/utils";

interface ProjectHeaderProps {
  projectId: number;
  name: string;
  description?: string;
}

export function ProjectHeader({ projectId, name, description }: ProjectHeaderProps) {
  const router = useRouter();
  const updateProject = useUpdateProject();

  function saveTitle(next: string) {
    updateProject.mutate(
      { projectId, data: { name: next } },
      {
        onSuccess: () => router.replace(`/projects/${slugify(next)}/tasks`),
        onError: () => toast.error("Failed to rename project"),
      }
    );
  }

  function saveDescription(next: string) {
    updateProject.mutate(
      { projectId, data: { description: next } },
      { onError: () => toast.error("Failed to update description") }
    );
  }

  return (
    <div>
      <InlineEditableText
        value={name}
        onSave={saveTitle}
        allowEmpty={false}
        className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
      />
      <InlineEditableText
        value={description ?? ""}
        onSave={saveDescription}
        placeholder="Add a description..."
        as="textarea"
        rows={1}
        className="text-sm text-muted-foreground"
      />
    </div>
  );
}
