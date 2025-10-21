import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../service/project.service";


export const useAllUsers = (enabled = true) => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: getAllUsers,
    enabled,
    staleTime: 1000 * 60 * 5, 
  });
};