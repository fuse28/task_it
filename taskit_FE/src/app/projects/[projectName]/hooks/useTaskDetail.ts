import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTask,
  createComment,
  updateComment,
  deleteComment,
} from "../tasks/service/task.service";

export function useUpdateTask(taskId: number, projectId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title?: string; description?: string; assigneeIds?: number[] }) =>
      updateTask(taskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
      qc.invalidateQueries({ queryKey: ["sections", projectId] });
    },
  });
}

export function useCreateComment(taskId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ content, mentionedUserIds }: { content: string; mentionedUserIds: number[] }) =>
      createComment(taskId, content, mentionedUserIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

export function useUpdateComment(taskId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      content,
      mentionedUserIds,
    }: {
      commentId: number;
      content: string;
      mentionedUserIds: number[];
    }) => updateComment(commentId, content, mentionedUserIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}

export function useDeleteComment(taskId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
