

import MembersList from "@/components/MemberList";


export default async function MemberList() {
  const res = await fetch("http://localhost:9002/api/Member");
const members = await res.json();
  return (
    <div className="flex gap-2">
     
    <div className="p-6 space-y-6 flex">
      

      <MembersList members={members}/>
    </div>
    </div>
  );
}
