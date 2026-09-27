"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import SectionTabs from "./SectionTabs";
import StageColumn from "./StageColumn";
import { TaskDetailModal } from "./TaskDetailModal";
import { EmptyState } from "@/components/EmptyState";
import { LayoutGridIcon } from "lucide-react";
import { useCreateSection } from "../../hooks/useCreateSection";
import { useSections } from "../../hooks/useSection";
import { useCreateStage } from "../../hooks/useCreateStage";
import { useUpdateStage } from "../../hooks/useUpdateStage";
import { useCreateTask } from "../../hooks/useCreateTask";
import type { TeamMember, TaskSummary } from "../types";

interface Stage {
  id: number;
  title: string;
  tasks: TaskSummary[];
}

interface Section {
  id: number;
  title: string;
  stages: Stage[];
}

export default function Board({ projectId, team }: { projectId: number; team: TeamMember[] }) {
  const { data: sections = [], isLoading } = useSections(projectId);
  const createSection = useCreateSection(projectId);
  const createStage = useCreateStage(projectId);
  const updateStage = useUpdateStage(projectId);
  const createTask = useCreateTask(projectId);

  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [addingStage, setAddingStage] = useState(false);
  const [stageTitle, setStageTitle] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    if (!activeSectionId && sections.length > 0) {
      setActiveSectionId(sections[0].id);
    }
  }, [sections, activeSectionId]);

  const activeSection: Section | undefined = sections.find(
    (s: Section) => s.id === activeSectionId
  );

  function submitStage() {
    if (stageTitle.trim() && activeSectionId) {
      createStage.mutate(
        { sectionId: activeSectionId, title: stageTitle.trim() },
        { onError: () => toast.error("Failed to create stage") }
      );
      setStageTitle("");
      setAddingStage(false);
    }
  }

  function handleAddTask(stageId: number, title: string) {
    createTask.mutate(
      { stageId, title },
      { onError: () => toast.error("Failed to create task") }
    );
  }

  function handleRenameStage(stageId: number, title: string) {
    updateStage.mutate(
      { stageId, title },
      { onError: () => toast.error("Failed to rename stage") }
    );
  }

  function handleAddSection(title: string) {
    createSection.mutate(title, {
      onError: () => toast.error("Failed to create section"),
    });
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading board...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTabs
        sections={sections}
        activeSectionId={activeSectionId}
        onSelect={setActiveSectionId}
        onAdd={handleAddSection}
      />

      {sections.length === 0 && (
        <EmptyState
          icon={LayoutGridIcon}
          title="No sections yet"
          description="Add a section above to start building your board."
        />
      )}

      {activeSection && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {activeSection.stages.map((stage) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              onAddTask={handleAddTask}
              onTaskClick={setSelectedTaskId}
              onRenameStage={handleRenameStage}
            />
          ))}

          {addingStage ? (
            <div className="flex w-64 shrink-0 flex-col gap-2 rounded-xl bg-muted p-3">
              <input
                autoFocus
                value={stageTitle}
                onChange={(e) => setStageTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitStage();
                  if (e.key === "Escape") { setAddingStage(false); setStageTitle(""); }
                }}
                placeholder="Stage name..."
                className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitStage}
                  className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                >
                  Add
                </button>
                <button
                  onClick={() => { setAddingStage(false); setStageTitle(""); }}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingStage(true)}
              className="flex h-12 w-64 shrink-0 items-center justify-center gap-1 rounded-xl bg-muted text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <PlusIcon className="size-4" />
              Add stage
            </button>
          )}
        </div>
      )}

      <TaskDetailModal
        taskId={selectedTaskId}
        projectId={projectId}
        team={team}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
      />
    </div>
  );
}
