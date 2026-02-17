"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React, { useState } from "react";

type Member = {
  member_Id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  Status: string;
  dashboard?: {
    loans: { _sum: { balance: number }; _count: number };
    savings: { _sum: { amount: number }; _count: number };
    groupTransactions: { type: string; amount: number }[];
    shareCapital: { _sum: { balance: number } };
  };
};

export default function MembersList({ members }: { members: Member[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of rows per page

  const activeMembers = members.filter((m) => m.Status==="active");
  const inactiveMembers = members.filter((m) => m.Status==="inactive");

  // Apply search filter
  const filterMembers = (list: Member[]) =>
    list.filter(
      (m) =>
        m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination logic
  const paginate = (list: Member[]) => {
    const start = (currentPage - 1) * pageSize;
    return list.slice(start, start + pageSize);
  };

  const renderTable = (list: Member[]) => {
    const filtered = filterMembers(list);
    const paginated = paginate(filtered);
    const totalPages = Math.ceil(filtered.length / pageSize);

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                <th className="px-4 py-2 text-left">Member ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Total Loans</th>
                <th className="px-4 py-2 text-left">Total Savings</th>
                <th className="px-4 py-2 text-left">Share Capital</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((m) => (
                <tr
                  key={m.member_Id}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-gray-800">
                    <Link href={`/admin/members/${m.member_Id}`}>
                      {m.member_Id}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{m.email}</td>
                  <td className="px-4 py-2 text-gray-700">{m.phone}</td>
                  <td className="px-4 py-2">
                    {m.dashboard?.loans._sum.balance ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    {m.dashboard?.savings._sum.amount ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    {m.dashboard?.shareCapital._sum.balance ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    {m.Status==="active" ? (
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-700">
                        Inactive
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-lg rounded-xl bg-white">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-extrabold text-blue-700 tracking-wide">
          Registered Members
        </CardTitle>
        <CardDescription className="text-gray-500">
          Overview of all members in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page when searching
          }}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active Members
              <Badge variant="secondary">{activeMembers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              Inactive Members
              <Badge variant="secondary">{inactiveMembers.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">{renderTable(activeMembers)}</TabsContent>
          <TabsContent value="inactive">{renderTable(inactiveMembers)}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
