"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          LoanView
        </Link>

        {/* Desktop Menu */}
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
              {/* Avatar */}
              <Link href={`/user/${user.id}`} className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{user.email}</span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
          <span className="w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {/* Mobile Menu */}
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
