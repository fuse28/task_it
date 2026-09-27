import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getAllUsers,
  getProjects,
  updateProject,
} from "../service/project.service";

export const useAllUsers = (enabled = true) => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", "all"] });
    },
  });
};
export const useAllProjects = (enabled = true) => {
  return useQuery({
    queryKey: ["projects", "all"],
    queryFn: getProjects,
    enabled,
  });
};
export const useDeleteProject = () => {
  return useMutation({
    mutationFn: deleteProject,
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: number;
      data: { name?: string; description?: string };
    }) => updateProject(projectId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects", "all"] });
      qc.invalidateQueries({ queryKey: ["project"] });
    },
  });
};
