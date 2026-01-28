"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname.startsWith(path)
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <nav className="w-64 h-screen border-r bg-white p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-6">LoanView Admin</h1>

      <ul className="space-y-3">
        <li>
          <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
            Dashboard
          </Link>
        </li>

        <li>
          <Link href="/admin/dashboard/groups" className={linkClass("/admin/dashboard/groups")}>
            Groups
          </Link>
        </li>

        <li>
          <Link href="/admin/members" className={linkClass("/admin/members")}>
            Members
          </Link>
        </li>

        <li>
          <Link href="/admin/savings" className={linkClass("/admin/savings")}>
            Savings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
