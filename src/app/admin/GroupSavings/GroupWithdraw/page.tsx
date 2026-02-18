"use client";

import { useState, useEffect } from "react";

interface Group {
  group_id: string;
  name: string;
  balance: number;
}


interface Member {
  member_Id: number;
  firstName: string;
  lastName: string;
}


export default function GroupWithdrawal() {
  const [groups, setGroups] = useState<Group[]>([]);

  const [members, setMembers] = useState<Member[]>([]);


  const [groupId, setGroupId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    

    fetch("/api/GroupSavings/allGroups")
      .then((res) => res.json())
      .then(setGroups);
  }, []);

  useEffect(() => {
   

      if (!groupId) return;

    fetch(`/api/GroupSavings/${groupId}/members`)
      .then((res) => res.json())
      .then((data) => { 
       
        setMembers(data);
        

      });
  }, [groupId]);

  const handleWithdwals = async () => {
    const res = await fetch(`/api/GroupSavings/GroupWithdrawal/${groupId}/member_withdrawal`, {
      // src\app\api\GroupSavings\GroupWithdrawal\[groupId]\member_withdrawal\route.ts
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        memberId: Number(memberId),
        interest: Number(interest),
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Withdrawal successful!");
      setAmount("");
      setMemberId("");
      setGroupId("");
      setInterest("");
    } else {
      setMessage(data.error || "Withdrawal failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-bold">Withdraw from Group Savings</h2>

      {/* Select Group */}
      <div>
        <label className="block font-medium mb-1">Select Group</label>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Choose group</option>
          {groups.map((g) => (
            <option key={g.group_id} value={g.group_id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* Select Member */}
      <div>
        <label className="block font-medium mb-1">Select Member</label>
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Choose member</option>
          {Array.isArray(members) &&
          members.map((m) => (
            <option key={m.member_Id} value={m.member_Id}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block font-medium mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Interest</label>
        <input
          type="number"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleWithdwals}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Withdraw
      </button>

      {message && <p className="text-center text-green-600">{message}</p>}
    </div>
  );
}
