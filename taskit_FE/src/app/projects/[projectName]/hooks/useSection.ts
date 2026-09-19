import { useQuery } from "@tanstack/react-query";
import { getSections } from "../tasks/service/task.service";

export function useSections(projectId: number) {
  return useQuery({
    queryKey: ["sections", projectId],
    queryFn: () => getSections(projectId),
    enabled: !!projectId,
  });
}
