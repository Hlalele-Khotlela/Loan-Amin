"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export function useAuth(requiredRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");


    if (!token) {
      setLoading(false);
      if (requiredRole) router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Role check
      if (requiredRole && payload.role !== requiredRole) {
        setLoading(false);
        router.push("/unauthorized");
        return;
      }

      setUser(payload);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("token");
      setLoading(false);
      router.push("/login");
    }
  }, []);

  return { user, loading };
}
