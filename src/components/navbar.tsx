"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function decodeJWT(token: string) {
    try {
      const base64 = token.split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const padded = base64.padEnd(
        base64.length + (4 - (base64.length % 4)) % 4,
        "="
      );

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  useEffect(() => {
  function checkToken() {
    const token = Cookies.get("token");
    if (!token) return;

    const payload = decodeJWT(token);
    if (!payload) return;

    setUser({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  }

  // Initial check
  checkToken();

  // Re-check after hydration
  const interval = setInterval(checkToken, 300);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
  const interval = setInterval(() => {
    const token = Cookies.get("token");
    if (token) {
      const payload = decodeJWT(token);
      if (payload) {
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      }
    }
  }, 200);

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const token = Cookies.get("token");   // 🔥 read from cookie now

    if (!token) {
      setUser(null);
      return;
    }

    const payload = decodeJWT(token);

    if (!payload) {
      console.error("invalid token");
      setUser(null);
      return;
    }

    setUser({
      id: payload.id,
      email: payload.email,
      role: payload.role,
    });
  }, []);

  function logout() {
    Cookies.remove("token");   // 🔥 remove cookie
    setUser(null);
    router.push("/login");
  }

  return (
   <nav className="w-full border-b bg-white sticky top-0 z-50">
  <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

    <Link href="/" className="text-xl font-bold text-primary">
      LoanView
    </Link>

    <div className="hidden md:flex items-center gap-6">
      {!user && (
        <Link
          href="/login"
          className="px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
        >
          Login
        </Link>
      )}

      {user && (
        <div className="flex items-center gap-4">
          <Link href={`/user/${user.id}`} className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{user.email}</span>
          </Link>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>

    <button
      className="md:hidden flex flex-col gap-1"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <span className="w-6 h-0.5 bg-black"></span>
      <span className="w-6 h-0.5 bg-black"></span>
      <span className="w-6 h-0.5 bg-black"></span>
    </button>
  </div>

  {menuOpen && (
    <div className="md:hidden bg-white border-t p-4 space-y-4">
      {!user && (
        <Link
          href="/login"
          className="block px-4 py-2 rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition"
          onClick={() => setMenuOpen(false)}
        >
          Login
        </Link>
      )}

      {user && (
        <>
          <Link
            href={`/user/${user.id}`}
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{user.email}</span>
          </Link>

          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="w-full px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )}
</nav>

  );
}
