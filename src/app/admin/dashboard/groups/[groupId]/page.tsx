import GroupTransactions from "@/components/grouptrans";
import GroupSummary from "../../../../../components/GroupSummary";
import GroupMembersList from "../../../../../components/GroupMembersList";
import RecentActivity from "../../../../../components/RecentActivity";
import GroupClient from "./groupCient";
// import { useRouter } from "next/navigation";


interface PageProps {
     params: { groupId: string; };
     } 
export default async function GroupDashboard({ params, }: { params: Promise<{ groupId: string }>; }) { const { groupId } = await params; // <-- this is correct
const baseUrl = "http://localhost:9002"; // Adjust based on your environment     
const res = await fetch(new URL(`/api/GroupSavings/${groupId}`, baseUrl), { 
        cache: "no-store", });

  const group = await res.json();
  const members = await fetch (new URL(`/api/Member`, baseUrl), {
    cache: "no-store",
  })

const allMembers = await members.json();



  return (
    <GroupClient group={group} 
    groupId={groupId} 
    members={allMembers }
    // onUpdateGroup={()=> {}}
    />
  )
    
}
