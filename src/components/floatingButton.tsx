"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function FloatingAdminButton() {
  const { user } = useAuth();

  // Only show for Credit users
  if (user?.role !== "CreditMember") return null;

  return (
    <Link
      href="/admin/dashboard"
      className="
        fixed
        bottom-6
        right-60
        bg-blue-600
        text-white
        px-5
        py-3
       
        shadow-lg
        hover:bg-blue-700
        transition
        font-medium
      "
    >
      Admin Panel
    </Link>
  );
}
