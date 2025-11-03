import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createProject,
  getAllUsers,
  getProjects,
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
  return useMutation({
    mutationFn: createProject,
  });
};
export const useAllProjects = () => {
  return useQuery({
    queryKey: ["projects", "all"],
    queryFn: getProjects,
  });
};
