"use client";
import { useEffect, useState } from "react";

export default function GroupInterestTable() {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/Owner/Earnings");
      const json = await res.json();
      setGroups(json.groupIntrest ?? []);
    }
    fetchData();
  }, []);

  if (!groups.length) return <p>No group interest data available</p>;

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 rounded-lg mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Group ID</th>
            <th className="px-4 py-2 border">Group Name</th>
            <th className="px-4 py-2 border">Total Interest</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.group_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border text-center">{g.group_id ?? "N/A"}</td>
              <td className="px-4 py-2 border text-center">{g.name ?? "N/A"}</td>
              <td className="px-4 py-2 border text-right">
                {Number(g._sum.ownerShare).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
