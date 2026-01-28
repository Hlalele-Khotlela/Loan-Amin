// src/app/admin/Loans/[member_Id]/[loanId]/transactions/LoanClient.tsx
"use client";

import { useState } from "react";
import { MemberModal } from "@/components/memberEditModal";
import { usePermission } from "@/hooks/usePermission";



import Link from "next/link";
// import { LoanDetails } from "./LoanDetails";

export default function MemberClient({ member, dashboardData }: { member: any; dashboardData: any; }) {
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const { canApproveLoans, canManageStaff, canViewSavings } = usePermission();


 

  async function handleConfirm(updatemember: any) {
    if (mode === "delete") {
      await fetch(`/api/Member/${updatemember.member_Id}`, { method: "DELETE" });
    } else if (mode === "edit") {
      await fetch(`/api/Member/${updatemember.member_Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatemember),
      });
    }
    setSelectedMember(null);
    setMode(null);
    // TODO: refresh state or re-fetch loans
  }

  return (

    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {member.firstName} {member.lastName}
        </h1>

        <div className="flex gap-3">

          
{canApproveLoans && (
           <button
                  onClick={() => {
                    setSelectedMember(member);
                    setMode("edit");
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
)}

{canApproveLoans && (
          <button
                  onClick={() => {
                    setSelectedMember(member);
                    setMode("delete");
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                )}
        </div>
      </div>

      

      {/* Member Info */}
      <div className="bg-white shadow rounded-lg p-6 border space-y-2 grid grid-cols-4 gap-6">
        <div className=" gap-2 ">
           <h2 className="text-lg font-semibold">Member Information</h2>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>Joined:</strong> {new Date(member.createdAt).toDateString()}</p>

        </div>
        <div className="gap-8">
          <h2 className="text-lg font-semibold">Loans</h2>
          {/* <p>Total Borrowed: {loans._sum.Principal}</p> */}
            <p>Total Borrowed: {dashboardData.loans._sum.Principal?.toString() ?? "0"}</p>
        <p>Total Payable: {dashboardData.loans._sum.totals_payeable?.toString() ?? "0"}</p>
        <p>Outstanding Balance: {dashboardData.loans._sum.balance?.toString() ?? "0"}</p>
        </div>

          <div className="gap-8">
          <h2 className="text-lg font-semibold">Savings</h2>
          <p>Total Savings: {dashboardData.savings._sum.amount?.toString() ?? "0"}</p>

        </div>

          <div className="gap-8">
          <h2 className="text-lg font-semibold">Group Savings</h2>
          {dashboardData.groupTransactions.map((tx: any) => (
          <p key={tx.type}>
            {tx.type}: {tx.amount?.toString()}
          </p>
        ))}
        </div>
       
      </div>

      {/* Loans */}
      <div className="bg-white shadow rounded-lg p-6 border space-y-2">
        <h2 className="text-lg font-semibold">Loans</h2>
        {member.loan.length === 0 ? (
          <p className="text-gray-600">No loans recorded.</p>
        ) : (
          <ul className="space-y-2">
            <table className="min-w-full border border-gray-300">
              <thead>
                
                  <tr className="bg-gray-100">
               <th className="px-4 py-2 border">Principal</th>
               <th className="px-4 py-2 border">Interest</th>
               <th className="px-4 py-2 border">Balance</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Issued</th>
              <th className="px-4 py-2 border">View</th>
                </tr>
              </thead>
              <tbody>
               {member.loan.map((l: any) =>(
                <tr key={l.loan_id}>
                 <td className="px-4 py-4 border">
                   {l.Principal}
               </td>
                <td className="px-4 py-4 border">{l.intrests}</td>
                <td className="px-4 py-4 border">{l.balance.toString()}</td>
              <td className="px-4 py-4 border">{l.loan_type}</td>
                   <td className="px-4 py-4 border"> {new Date(l.created_at).toLocaleDateString()}</td>
                   <td className="px-4 py-4 border"> 
                                           <Link
                    href={`/admin/Loans/${l.member_Id}/${l.loan_id}/transactions`}
                    className="text-green-600"
                  >
                    View
                  </Link>
                   </td>
            </tr>
               ))}
              </tbody>
            </table>
            
          </ul>
        )}
      </div>

      
      {/* Individual Savings */}

        <div className="bg-white shadow rounded-lg p-6 border space-y-2">
        <h2 className="text-lg font-semibold">Individual Savings</h2>
        {member.savings.length === 0 ? (
          <p className="text-gray-600">No Individual recorded.</p>
        ) : (
          <ul className="space-y-2">
            <table className="min-w-full border border-gray-300">
              <thead>
                
                  <tr className="bg-gray-100">
               <th className="px-4 py-2 border">Savings Type</th>
               <th className="px-4 py-2 border">Amount</th>
               <th className="px-4 py-2 border">Interests</th>
              <th className="px-4 py-2 border">Started At</th>
              <th className="px-4 py-2 border">Accoumulated totals</th>
              <th className="px-4 py-2 border">View</th>
                </tr>
              </thead>
              <tbody>
               {member.savings.map((s: any) =>(
                <tr key={s.savings_id}>
                 <td className="px-4 py-4 border">
                   {s.savings_type}
               </td>
                <td className="px-4 py-4 border">{s.amount}</td>    
                <td className="px-4 py-4 border">{s.interest}</td>                          
                   <td className="px-4 py-4 border"> {new Date(s.started_at).toLocaleDateString()}</td>
                   <td className="px-4 py-4 border">{s.total}</td>
                   <td className="px-4 py-4 border"> 
                                           <Link
                    href={`/admin/savings/allSavings/${s.member_Id}/${s.savings_id}/`}
                    className="text-green-600"
                  >
                    View
                  </Link>
                   </td>
            </tr>
               ))}
              </tbody>
            </table>
            
          </ul>
        )}
      </div>

   

      {/* Group Groups */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Groups Savings</h2>

        {member.groupSavings.length === 0 ? (
          <p className="text-gray-600">This member is not part of any groups.</p>
        ) : (
          <ul className="space-y-3">
            {member.groupSavings.map((g: any) => (
              <li key={g.group_id}>
                <Link
                  href={`/admin/dashboard/groups/${g.group_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Group Deposits */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Group Deposits</h2>

        {member.GroupDeposits.length === 0 ? (
          <p className="text-gray-600">No deposits recorded.</p>
        ) : (
          <ul className="space-y-2">
            {member.GroupDeposits.map((d: any) => (
              <li key={d.deposit_id} className="border-b pb-2">
                R {d.amount} — {new Date(d.deposited_at).toLocaleDateString()} -- Group#{d.group_id}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* loan requests */}

        <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Loan Requests</h2>
        {member.loanrequest.length === 0 ? (
          <p className="text-gray-600">No loan requests recorded.</p>
        ) : (
            <ul className="space-y-2">
            {member.loanrequest.map((lr: any) => (
                <li key={lr.id} className="border-b pb-2">
                R {lr.amount} — {lr.status} — {new Date(lr.requested_at).toLocaleDateString()}
                </li>
            ))}
            </ul>
        )}
      </div>

      {/* Group Withdrawals */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Group Withdrawals</h2>

        {member.GroupWithdrawal.length === 0 ? (
          <p className="text-gray-600">No withdrawals recorded.</p>
        ) : (
          <ul className="space-y-2">
            {member.GroupWithdrawal.map((w: any) => (
              <li key={w.withdrawal_id} className="border-b pb-2">
                R {w.amount} — {new Date(w.created_at).toLocaleDateString()} -- Group#{w.group_id}
              </li>
            ))}
          </ul>
        )}
      </div>

      {mode && selectedMember &&(
              <MemberModal
  member={selectedMember}
  mode={mode}
  onClose={() => {
    setSelectedMember(null);
    setMode(null);
  }}
  onConfirm={handleConfirm}
/>

      )}



    </div>
  )
}
     
  
