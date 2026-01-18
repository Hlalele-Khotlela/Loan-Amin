import { GroupSummaryType } from "@/types/GroupSummaryTypes";
import { useEffect } from "react";
export default function MembersList({ members }: { members?: GroupSummaryType["members"] }) {
 
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Members</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Name</th>
            <th>Member ID</th>
            <th>Member Deposit</th>
            <th>Member Withdrawal</th>
            <th>Member Balance</th>
          </tr>
        </thead>

        <tbody>
          {members?.map((m) => (
            <tr key={m.member_Id} className="border-t">
              <td>{m.firstName} {m.lastName}</td>
              <td>{m.member_Id}</td>
              <td>{m.totalDeposited}</td>
              <td>{m.totalWithdrawn}</td>
              <td>{m.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
