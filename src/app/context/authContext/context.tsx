"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  // Hydrate from cookie/session on mount
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/me");
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
