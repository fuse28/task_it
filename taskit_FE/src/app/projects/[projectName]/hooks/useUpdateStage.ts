import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStage } from "../tasks/service/task.service";

export function useUpdateStage(projectId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ stageId, title }: { stageId: number; title: string }) =>
      updateStage(stageId, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sections", projectId] });
    },
  });
}
