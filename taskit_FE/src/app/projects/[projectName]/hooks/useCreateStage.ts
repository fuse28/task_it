import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStage } from "../tasks/service/task.service";

export function useCreateStage(projectId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, title }: { sectionId: number; title: string }) =>
      createStage(sectionId, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sections", projectId] });
    },
  });
}
