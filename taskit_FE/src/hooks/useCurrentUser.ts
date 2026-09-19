import { useQuery } from "@tanstack/react-query";
import API from "@/lib/interceptor";

export interface CurrentUser {
  id: number;
  name?: string;
  email: string;
  accountType: string;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await API.get("/users/profile");
  return res.data;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
    staleTime: Infinity,
  });
}
