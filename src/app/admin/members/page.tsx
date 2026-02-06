

import MembersList from "@/components/MemberList";


export default async function MemberList() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";
  const res = await fetch(`${baseUrl}/api/Member`, { cache: "no-store" });

  
const members = await res.json();
  return (
    <div className="flex gap-2">
     
    <div className="p-6 space-y-6 flex">
      

      <MembersList members={members}/>
    </div>
    </div>
  );
}
