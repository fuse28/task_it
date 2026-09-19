import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../tasks/service/task.service";

export function useCreateTask(projectId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, title }: { stageId: number; title: string }) =>
      createTask(stageId, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sections", projectId] });
    },
  });
}
