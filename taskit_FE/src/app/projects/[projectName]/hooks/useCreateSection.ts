import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSection } from "../tasks/service/task.service";

export function useCreateSection(projectId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createSection(projectId, title),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sections", projectId] });
    },
  });
}
