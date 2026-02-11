"use client";
import { useState } from "react";
import { GroupSummaryType } from "@/types/GroupSummaryTypes";
import EditAccumulatedInterestModal from "@/components/memberInterestModal";

export default function MembersList({
  members,
  groupId,
}: {
  members?: GroupSummaryType["members"];
  groupId: number;
}) {
  const [selectedInterest, setSelectedInterest] = useState<any | null>(null);

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
            <th>Member Interest</th>
            
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {members?.map((m) => {
            const latestInterestRecord = m.MemberInterest
              ?.filter((mi: any) => mi.group_Id === groupId)
              .slice(-1)[0];

            const latestInterest = latestInterestRecord?.AccumulatedInterest || 0;

            return (
              <tr key={m.member_Id} className="border-t">
                <td>{m.firstName} {m.lastName}</td>
                <td>{m.member_Id}</td>
                <td>{Number(m.totalDeposited).toFixed(2)}</td>
                <td>{Number(m.totalWithdrawn).toFixed(2)}</td>
                <td>{Number(latestInterest).toFixed(2)}</td>
                
                <td>
                  {latestInterestRecord ? (
                  <button
                    className="text-blue-600 underline"
                    onClick={() =>
                      setSelectedInterest({
                        id: latestInterestRecord.id,
                        accumulated: Number(latestInterestRecord.AccumulatedInterest),
                      })
                    }
                  >
                    Edit
                  </button>
                  ) : (
                    <span className="text-gray-400">No interest record</span>

                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedInterest && (
        <EditAccumulatedInterestModal
          interestId={selectedInterest.id}
          accumulated={selectedInterest.accumulated}
          onClose={() => setSelectedInterest(null)}
          onSave={(updated) => {
            console.log("Updated interest:", updated);
            setSelectedInterest(null);
          }}
        />
      )}
    </div>
  );
}
