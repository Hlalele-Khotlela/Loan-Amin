import GroupTransactions from "@/components/grouptrans";
import GroupSummary from "../../../../../components/GroupSummary";
import GroupMembersList from "../../../../../components/GroupMembersList";
import RecentActivity from "../../../../../components/RecentActivity";
import GroupClient from "./groupCient";
// import { useRouter } from "next/navigation";


interface PageProps {
     params: { groupId: string; };
     } 
export default async function GroupDashboard({ params, }: { params: Promise<{ groupId: string }>; 
}) { const { groupId } = await params;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!; // Adjust based on your environment     
const res = await fetch(`${baseUrl}/api/GroupSavings/${groupId}`,  { 
        cache: "no-store", });

  const group = await res.json();

  // fetch members
  const membersRes = await fetch (`${baseUrl}/api/Member`, {
    cache: "no-store",
  })

const allMembers = await membersRes.json();



  return (
    <GroupClient group={group} 
    groupId={groupId} 
    members={allMembers }
    // onUpdateGroup={()=> {}}
    />
  )
    
}
