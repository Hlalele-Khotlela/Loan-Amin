import { GroupSummaryType } from "@/types/GroupSummaryTypes";
export default function GroupSummary({ group }: { group: GroupSummaryType }) {
  return (
    <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-xl shadow">
      <div>
        <h3 className="text-gray-500">Group Name</h3>
        <p className="text-xl font-bold">{group.name}</p>
      </div>

      <div>
        <h3 className="text-gray-500">Total Savings</h3>
        <p className="text-xl font-bold text-green-600">
          R {Number(group.total_Savings).toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="text-gray-500">Starting Amount</h3>
        <p className="text-xl font-bold">R {Number(group.amount).toFixed(2)}</p>
      </div>

      <div>
        <h3 className="text-gray-500">Combined Total</h3>
        <p className="text-xl font-bold text-blue-600">
          R {(Number(group.amount) + Number(group.total_Savings)).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
