import { useQuery } from "@tanstack/react-query";
import { getTask } from "../tasks/service/task.service";
import type { TaskDetail } from "../tasks/types";

export function useTask(taskId: number | null) {
  return useQuery<TaskDetail>({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId as number),
    enabled: !!taskId,
  });
}
