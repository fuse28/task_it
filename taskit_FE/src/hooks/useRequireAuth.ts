"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/auth");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  return isAuthenticated;
}
