"use client";

import Link from "next/link";
import { Home, UserPlus, PiggyBank, FileSliders } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


export function AdminNav() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload); // contains id, email, role
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  if (user?.role !== "Admin") {
    return null; // hide menu for non-admins
  }

  return (
    <div className="w-64 flex-none shadow-lg bg-slate-200 rounded-lg border p-6">
      <ul className="mt-3 space-y-4">

        <li>
          <Link href="/admin/dashboard" className="flex items-center">
            <Home className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/register" className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Member Registration</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/Loan-Requests" className="flex items-center">
            <PiggyBank className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Loan Request</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/savings/allSavings" className="flex items-center">
            <PiggyBank className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Savings</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/dashboard/groups" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Group Savings</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/members" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Members</span>
          </Link>
        </li>

        <li>
          <Link href="#" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Deposit Slips</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/Loans" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Loans</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/Earnings" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Earnings</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/incomesAndExp" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Incomes</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/EmergencyFund" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Emergency Fund</span>
          </Link>
        </li>

        <li>
          <Link href="/admin/Expenses" className="flex items-center">
            <FileSliders className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">Expenses</span>
          </Link>
        </li>

      </ul>
    </div>
  );
}
