import { useQuery } from "@tanstack/react-query";
import API from "@/lib/interceptor";

async function fetchProject(projectName: string) {
  const res = await API.get(`/projects/${projectName}`);
  return res.data;
}

export function useProject(projectName: string) {
  return useQuery({
    queryKey: ["project", projectName],
    queryFn: () => fetchProject(projectName),
    enabled: !!projectName,
  });
}
