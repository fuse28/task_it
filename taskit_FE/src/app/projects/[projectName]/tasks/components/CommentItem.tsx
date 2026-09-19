"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { splitMentionSegments } from "@/lib/mentions";
import { CommentComposer } from "./CommentComposer";
import type { TaskComment, TeamMember } from "../types";

interface CommentItemProps {
  comment: TaskComment;
  currentUserId?: number;
  team: TeamMember[];
  onEdit: (content: string, mentionedUserIds: number[]) => void;
  onDelete: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export function CommentItem({
  comment,
  currentUserId,
  team,
  onEdit,
  onDelete,
  isSaving,
  isDeleting,
}: CommentItemProps) {
  const [editing, setEditing] = useState(false);
  const isOwn = comment.author.id === currentUserId;
  const isEdited = comment.updatedAt !== comment.createdAt;
  const displayName = comment.author.name || comment.author.email;
  const initials = displayName[0]?.toUpperCase();

  if (editing) {
    return (
      <div className="flex gap-3">
        <Avatar className="size-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CommentComposer
            team={team}
            initialValue={comment.content}
            submitLabel="Save"
            onSubmit={(content, mentionedUserIds) => {
              onEdit(content, mentionedUserIds);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
            isPending={isSaving}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar className="size-8">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString()}
            {isEdited && ` · edited ${new Date(comment.updatedAt).toLocaleString()}`}
          </span>
        </div>
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">
          {splitMentionSegments(comment.content).map((segment, i) =>
            segment.type === "mention" ? (
              <span key={i} className="rounded bg-primary/10 px-1 font-medium text-primary">
                @{segment.value}
              </span>
            ) : (
              <span key={i}>{segment.value}</span>
            )
          )}
        </p>
        {isOwn && (
          <div className="mt-1 flex gap-3">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
