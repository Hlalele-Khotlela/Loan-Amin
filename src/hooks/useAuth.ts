"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export function useAuth(allowedRoles?: string[]) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) {
          setLoading(false);
          if (allowedRoles) router.push("/login");
          return;
      }
      const data = await res.json();
      const payload = data.user; 

       if (allowedRoles && !allowedRoles.includes(payload.role)) {
        setLoading(false);
        router.push("/unauthorized");
        return;
    }
    setUser(payload);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    router.push("/");
  }
  };
  fetchUser();
},
   [allowedRoles, router]);

  return { user, loading };
}
