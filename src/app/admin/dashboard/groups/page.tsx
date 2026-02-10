import GroupCard from "../../../../components/GroupCard";
import GroupActs from "@/components/group-acts";

export default async function GroupsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// src\app\api\GroupSavings\[groupId]\route.ts
  const res = await fetch(`${baseUrl}/api/GroupSavings/AllGroupsDisp`,  {
    cache: "no-store",
  });

  const groups = await res.json();

  return (
    <div className="space-y-6 mx-4">
      <h1 className="text-2xl font-bold">All Groups</h1>
      <GroupActs />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-2">
        
        {groups.map((group: any) => (
          <GroupCard key={group.group_id} group={group} />
        ))}
      </div>
    </div>
  );
}
