"use client";
import { useState } from "react";
import GroupSummary from "@/components/GroupSummary";
import GroupTransactions from "@/components/grouptrans";
import GroupMembersList from "../../../../../components/GroupMembersList";
import RecentActivity from "../../../../../components/RecentActivity";
import GroupEditGroupModal from "@/components/GroupEditDelModal";

type GroupClient={
    group: any,
    groupId: any,
    members: any[],
   

}
export default function GroupClient({group, groupId, members,}: GroupClient){
const [showModal, setShowModal] = useState(false);

async function handleUpdateGroup(updatedGroup: any){
    await fetch(`/api/GroupSavings/${groupId}`,{
        
        method: "PUT",
        body: JSON.stringify(updatedGroup),
    });
    
    setShowModal(false);
}

return(
<div className="p-6 space-y-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Group Dashboard</h1>
        <p className="text-gray-600">Overview of group activities and members.</p>
      </div>
      <button
      onClick={() => setShowModal(true)}
      className="px-4 py-2 bg-blue-600 text-white rounded">
        Edit Group
      </button>

      

      <GroupSummary group={group} />
      <GroupMembersList members={group.members} />
      <RecentActivity deposits={group.deposits} withdrawals={group.withdrawals} />
      <GroupTransactions groupId={Number(groupId)} />
{showModal &&(
    <GroupEditGroupModal
    group={group}
    allMembers={members}
    onConfirm={handleUpdateGroup}
    onClose={() => setShowModal(false)}
    /> )}
    </div>
    )
}
