"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePermission } from "@/hooks/usePermission";

export default function LoanRequestDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();
 const { canApproveLoans, canManageStaff, canViewSavings, canCommentOnLoans } = usePermission();

  

  useEffect(() => {
    async function fetchLoan() {
      try {
        const res = await fetch(`/api/LoanRequests/${id}`);
        if (!res.ok) throw new Error("Failed to fetch loan request");
        const data = await res.json();
        setLoan(data);
      } catch (err) {
        toast({ title: "Error", description: "Could not load loan request" });
      } finally {
        setLoading(false);
      }
    }
    fetchLoan();
  }, [id]);

  async function handleAction(action: "approve" | "reject") {
    try {
      const res = await fetch(`/api/LoanRequests/updater/${id}?action=${action}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update loan request");
      toast({ title: "Success", description: `Loan ${action}d` });
      router.push("/admin/Loans");
    } catch (err) {
      toast({ title: "Error", description: "Could not update loan request" });
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!loan) return <p className="p-6">Loan request not found.</p>;

  const commentsCount = loan.LoanRequestComments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Loan Request Details</h1>

        {/* Member Info */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Member Info</h2>
          <p><span className="font-medium">ID:</span> {loan.member.member_Id}</p>
          <p><span className="font-medium">Name:</span> {loan.member.firstName} {loan.member.lastName}</p>
        </div>

        {/* Loan Info */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Loan Info</h2>
          <p><span className="font-medium">Type:</span> {loan.loan_type}</p>
          <p><span className="font-medium">Amount:</span> {loan.amount}</p>
          <p><span className="font-medium">Duration:</span> {loan.Loan_Duration} months</p>
          <p><span className="font-medium">Collateral Type:</span> {loan.collectrals[0]?.Type || "None"}</p>
        </div>

        {/* Collateral Contacts */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Collateral Contacts</h2>
          {loan.collectrals?.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1">
              {loan.collectrals.map((c: any, i: number) => (
                <li key={i} className="text-gray-700">
                  <span className="font-medium">{c.name}</span> — {c.phone}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No collateral contacts provided.</p>
          )}
        </div>

        {/* Status */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Status</h2>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              loan.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : loan.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {loan.status}
          </span>
        </div>

        {/* Comments Section */}

        {/* Comments Section */}
<div className="mt-6 border rounded-lg p-4 bg-gray-50">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">Comments</h2>

  {loan.LoanRequestComments?.length > 0 ? (
    <div className="relative">
      <div className="flex flex-col space-y-6">
        {loan.LoanRequestComments.map((c: any, i: number) => {
          const isLeft = i % 2 === 0; // alternate alignment
          return (
            <div key={c.id} className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
              <div className="flex items-start space-x-3 max-w-md">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {c.author.firstName[0]}
                </div>
                {/* Comment Card */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-sm text-gray-800">{c.comment}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    by <span className="font-medium">{c.author.firstName} {c.author.lastName}</span> —{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p className="text-sm text-gray-500">No comments yet.</p>
  )}

  {/* Add comment form */}
  {canCommentOnLoans && (
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      const content = (e.currentTarget.elements.namedItem("comment") as HTMLInputElement).value;

      // Replace with logged user ID from your auth/session
      const loggedUserId = user?.id; // e.g. from context or JWT

      const res = await fetch(`/api/LoanRequests/${loan.request_id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId: loggedUserId, content }),
      });
      if (res.ok) {
        toast({ title: "Comment added" });
        location.reload();
      }
    }}
    className="mt-4 flex gap-2"
  >
    <input
      type="text"
      name="comment"
      placeholder="Write a comment..."
      className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
      required
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Post
    </button>
  </form>
  )}
</div>

 


        {/* Actions */}
        {loan.status === "Pending" && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Actions</h2>
            <div className="flex gap-4">
              {canApproveLoans &&(
              <button
                onClick={() => handleAction("approve")}
                disabled={commentsCount < 3}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              )}

              {canApproveLoans && (
              <button
                onClick={() => handleAction("reject")}
                disabled={commentsCount < 3}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
              )}
            </div>
            {commentsCount < 3 && (
              <p className="mt-2 text-sm text-gray-500">
                At least <span className="font-medium">3 comments</span> are required before approving or rejecting.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
