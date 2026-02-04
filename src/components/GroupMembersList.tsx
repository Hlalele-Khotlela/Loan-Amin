import { GroupSummaryType } from "@/types/GroupSummaryTypes";

export default function MembersList({
  members,
  groupId,
}: {
  members?: GroupSummaryType["members"];
  groupId: number;
}) {
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
            <th>Member Balance</th>
          </tr>
        </thead>

        <tbody>
          {members?.map((m) => {
            const latestInterest = m.MemberInterest
              ?.filter((mi: any) => mi.group_Id === groupId) // 👈 filter by group
              .slice(-1)[0]?.AccumulatedInterest || 0;

            return (
              <tr key={m.member_Id} className="border-t">
                <td>{m.firstName} {m.lastName}</td>
                <td>{m.member_Id}</td>
                <td>{Number(m.totalDeposited).toFixed(2)}</td>
                <td>{Number(m.totalWithdrawn).toFixed(2)}</td>
                <td>{Number(latestInterest).toFixed(2)}</td>
                <td>{Number(m.balance).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
