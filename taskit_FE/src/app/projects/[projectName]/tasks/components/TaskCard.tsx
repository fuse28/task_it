"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TaskSummary } from "../types";

export default function TaskCard({
  task,
  onClick,
}: {
  task: TaskSummary;
  onClick: () => void;
}) {
  const assignees = task.assignees ?? [];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-sm font-medium text-foreground">{task.title}</p>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}
      {assignees.length > 0 && (
        <div className="mt-2 flex -space-x-2">
          {assignees.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="size-6 border-2 border-card">
              <AvatarFallback className="text-[10px]">
                {(member.name || member.email)[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
          {assignees.length > 3 && (
            <div className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] text-muted-foreground">
              +{assignees.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
