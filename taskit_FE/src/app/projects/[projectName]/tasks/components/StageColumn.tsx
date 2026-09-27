"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import TaskCard from "./TaskCard";
import { InlineEditableText } from "@/components/InlineEditableText";
import type { TaskSummary } from "../types";

interface Stage {
  id: number;
  title: string;
  tasks: TaskSummary[];
}

interface Props {
  stage: Stage;
  onAddTask: (stageId: number, title: string) => void;
  onTaskClick: (taskId: number) => void;
  onRenameStage: (stageId: number, title: string) => void;
}

export default function StageColumn({ stage, onAddTask, onTaskClick, onRenameStage }: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  function submit() {
    if (title.trim()) {
      onAddTask(stage.id, title.trim());
      setTitle("");
      setAdding(false);
    }
  }

  return (
    <div className="flex w-64 shrink-0 flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <InlineEditableText
          value={stage.title}
          onSave={(next) => onRenameStage(stage.id, next)}
          allowEmpty={false}
          className="text-sm font-semibold text-foreground"
        />
        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
          {stage.tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {stage.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>

      {adding ? (
        <div className="mt-1 flex flex-col gap-1">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") { setAdding(false); setTitle(""); }
            }}
            placeholder="Task name..."
            className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
            >
              Add
            </button>
            <button
              onClick={() => { setAdding(false); setTitle(""); }}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-1 flex items-center gap-1 px-1 text-left text-sm text-muted-foreground hover:text-foreground"
        >
          <PlusIcon className="size-3.5" />
          Add task
        </button>
      )}
    </div>
  );
}
