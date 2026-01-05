import GroupSummary from "../../../../../components/GroupSummary";
import MembersList from "../../../../../components/MembersList";
import RecentActivity from "../../../../../components/RecentActivity";


interface PageProps {
     params: { groupId: string; };
     } 
export default async function GroupDashboard({ params, }: { params: Promise<{ groupId: string }>; }) { const { groupId } = await params; // <-- this is correct
const baseUrl = "http://localhost:9002"; // Adjust based on your environment     
const res = await fetch(new URL(`/api/GroupSavings/${groupId}`, baseUrl), { 
        cache: "no-store", });

  const group = await res.json();
//   console.log("STATUS:", res.status);
// console.log("RAW:", await res.text());

//   console.log("PARAMS:", await PageProps.params);


  return (
    <div className="p-6 space-y-6">
      <GroupSummary group={group} />
      <MembersList members={group.members} />
      <RecentActivity deposits={group.deposits} withdrawals={group.withdrawals} />
    </div>
  );
}
