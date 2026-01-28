import { GroupSummaryType } from "@/types/GroupSummaryTypes";
export default function GroupSummary({ group }: { group: GroupSummaryType }) {
  return (
    <div className="grid grid-cols-5 gap-2 bg-white p-6 rounded-xl shadow mt-6">
      <div>
        <h3 className="text-gray-500">Group Name</h3>
        <p className="text-xl font-bold">{group.name}</p>
      </div>
      <div>
        <h3 className="text-gray-500">Starting Amount</h3>
        <p className="text-xl font-bold">R {Number(group.amount).toFixed(2)}</p>
      </div>

      <div>
        
        <h3 className="text-gray-500">Total Savings</h3>
        <p className="text-xl font-bold text-green-600">
          R {Number(group.total_Savings).toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="text-gray-500">Total Interest</h3>
        <p className="text-xl font-bold text-yellow-600">
          R {Number(group.interest).toFixed(2)}
        </p>
      </div>

      

      <div>
        <h3 className="text-gray-500">Combined Total(total & interest)</h3>
        <p className="text-xl font-bold text-blue-600">
          R {Number(group.current_total).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
