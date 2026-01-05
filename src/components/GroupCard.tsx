import Link from "next/link";

export default function GroupCard({ group }: any) {
  return (
    <Link
      href={`/admin/dashboard/groups/${group.group_id}`}
      className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition"
    >
      <h2 className="text-lg font-semibold">{group.name}</h2>
      <p className="text-sm text-gray-600">Type: {group.savings_type}</p>
      <p className="text-sm text-gray-600">
        Starting Amount: R {Number(group.amount).toFixed(2)}
      </p>
      <p className="text-sm text-gray-600">
        Total Savings: R {Number(group.total_Savings).toFixed(2)}
      </p>
    </Link>
  );
}
