import GroupTransactions from "@/components/grouptrans";
import GroupSummary from "../../../../../components/GroupSummary";
import GroupMembersList from "../../../../../components/GroupMembersList";
import RecentActivity from "../../../../../components/RecentActivity";
// import { useRouter } from "next/navigation";


interface PageProps {
     params: { groupId: string; };
     } 
export default async function GroupDashboard({ params, }: { params: Promise<{ groupId: string }>; }) { const { groupId } = await params; // <-- this is correct
const baseUrl = "http://localhost:9002"; // Adjust based on your environment     
const res = await fetch(new URL(`/api/GroupSavings/${groupId}`, baseUrl), { 
        cache: "no-store", });

  const group = await res.json();
  // const router = useRouter();
//   console.log("STATUS:", res.status);
// console.log("RAW:", await res.text());

//   console.log("PARAMS:", await PageProps.params);


  return (
    <div className="p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Group Dashboard</h1>
        <p className="text-gray-600">Overview of group activities and members.</p>
      </div>

     
    
      <GroupSummary group={group} />
      <GroupMembersList members={group.members} />
      <RecentActivity deposits={group.deposits} withdrawals={group.withdrawals} />
      <GroupTransactions groupId={Number(groupId)} />
    </div>
  );
}
