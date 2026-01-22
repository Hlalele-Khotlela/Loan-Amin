"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Role check
      if (requiredRole && payload.role !== requiredRole) {
        router.push("/unauthorized");
        return;
      }

      setUser(payload);
      setLoading(false);
    } catch (err) {
      router.push("/login");
    }
  }, []);

  return { user, loading };
}
