"use client";

import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import type { MultiValue } from "react-select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineEditableText } from "@/components/InlineEditableText";
import { useTask } from "../../hooks/useTask";
import {
  useUpdateTask,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from "../../hooks/useTaskDetail";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";
import type { TeamMember } from "../types";

interface TaskDetailModalProps {
  taskId: number | null;
  projectId: number;
  team: TeamMember[];
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailModal({ taskId, projectId, team, onOpenChange }: TaskDetailModalProps) {
  const { data: task, isLoading } = useTask(taskId);
  const { data: currentUser } = useCurrentUser();
  const updateTask = useUpdateTask(taskId ?? 0, projectId);
  const createComment = useCreateComment(taskId ?? 0);
  const updateComment = useUpdateComment(taskId ?? 0);
  const deleteComment = useDeleteComment(taskId ?? 0);

  const teamOptions: MultiSelectOption[] = team.map((member) => ({
    value: String(member.id),
    label: member.name || member.email,
  }));
  const assigneeValue: MultiSelectOption[] = (task?.assignees ?? []).map((member: TeamMember) => ({
    value: String(member.id),
    label: member.name || member.email,
  }));

  function saveTitle(next: string) {
    updateTask.mutate(
      { title: next },
      { onError: () => toast.error("Failed to update title") }
    );
  }

  function saveDescription(next: string) {
    updateTask.mutate(
      { description: next },
      { onError: () => toast.error("Failed to save description") }
    );
  }

  function handleAssigneesChange(next: MultiValue<MultiSelectOption>) {
    updateTask.mutate(
      { assigneeIds: next.map((option) => Number(option.value)) },
      { onError: () => toast.error("Failed to update assignees") }
    );
  }

  return (
    <Dialog open={!!taskId} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        {isLoading || !task ? (
          <div className="space-y-3">
            <DialogTitle className="sr-only">Loading task…</DialogTitle>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="sr-only">{task.title}</DialogTitle>
              <InlineEditableText
                value={task.title}
                onSave={saveTitle}
                allowEmpty={false}
                className="text-lg font-semibold text-foreground"
              />
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-1.5">
                <Label>Assignees</Label>
                <MultiSelect
                  options={teamOptions}
                  value={assigneeValue}
                  onValueChange={handleAssigneesChange}
                  placeholder="Assign team members"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Description</Label>
                <InlineEditableText
                  value={task.description ?? ""}
                  onSave={saveDescription}
                  placeholder="Add a description..."
                  as="textarea"
                  rows={2}
                  className="text-sm"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Comments</Label>
                <div className="space-y-4">
                  {task.comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  )}
                  {task.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      currentUserId={currentUser?.id}
                      team={team}
                      onEdit={(content, mentionedUserIds) =>
                        updateComment.mutate(
                          { commentId: comment.id, content, mentionedUserIds },
                          { onError: () => toast.error("Failed to update comment") }
                        )
                      }
                      onDelete={() =>
                        deleteComment.mutate(comment.id, {
                          onError: () => toast.error("Failed to delete comment"),
                        })
                      }
                      isSaving={updateComment.isPending}
                      isDeleting={deleteComment.isPending}
                    />
                  ))}
                </div>

                <CommentComposer
                  team={team}
                  onSubmit={(content, mentionedUserIds) =>
                    createComment.mutate(
                      { content, mentionedUserIds },
                      { onError: () => toast.error("Failed to post comment") }
                    )
                  }
                  isPending={createComment.isPending}
                />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
