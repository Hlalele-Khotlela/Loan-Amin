import { GroupSummaryType } from "@/types/GroupSummaryTypes";   
export default function RecentActivity({ deposits, withdrawals }: { deposits: GroupSummaryType["deposits"]; withdrawals: GroupSummaryType["withdrawals"]; }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Recent Activity</h2>

      <div className="space-y-3">
        {deposits?.slice(0, 5).map((d) => (
          <div key={d.deposit_id} className="flex justify-between text-green-600">
            <span>Deposit by Member {d.member_Id}</span>
            <span>R {Number(d.amount).toFixed(2)}</span>
          </div>
        ))}

        {withdrawals?.slice(0, 5).map((w) => (
          <div key={w.withdrawal_id} className="flex justify-between text-red-600">
            <span>Withdrawal by Member {w.member_Id}</span>
            <span>- R {Number(w.amount).toFixed(2)}</span>
          </div>
        ))}

        

        
      </div>
    </div>
  );
}
