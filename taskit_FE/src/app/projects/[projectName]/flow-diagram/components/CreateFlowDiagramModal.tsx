"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllProjects } from "@/app/projects/hooks/project";
import { useCreateFlowDiagram } from "../hooks/useFlowDiagrams";
import { slugify } from "@/lib/utils";

interface CreateFlowDiagramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProjectId: number;
}

export function CreateFlowDiagramModal({
  open,
  onOpenChange,
  currentProjectId,
}: CreateFlowDiagramModalProps) {
  const router = useRouter();
  const { data: projects = [] } = useAllProjects(open);
  const createFlowDiagram = useCreateFlowDiagram();

  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState(String(currentProjectId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setProjectId(String(currentProjectId));
      setError("");
    }
  }, [open, currentProjectId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }

    createFlowDiagram.mutate(
      { projectId: Number(projectId), name: trimmed },
      {
        onSuccess: (diagram) => {
          onOpenChange(false);
          const project = projects.find(
            (p: { id: number }) => p.id === Number(projectId)
          );
          const slug = project ? slugify(project.name) : undefined;
          if (slug) {
            router.push(`/projects/${slug}/flow-diagram/${diagram.id}`);
          }
        },
        onError: () => toast.error("Failed to create flow diagram"),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Flow Diagram</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="diagramName">Name</Label>
              <Input
                id="diagramName"
                placeholder="e.g. Checkout Flow"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="grid gap-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: { id: number; name: string }) => (
                    <SelectItem key={project.id} value={String(project.id)}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createFlowDiagram.isPending}>
              {createFlowDiagram.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
