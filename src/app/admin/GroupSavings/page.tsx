"use client";
import { useEffect, useState } from "react";

type Member = {
  member_Id: number;
  firstName: string;
  lastName: string;
};

export default function CreateGroupSavingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [Minamount, setMinAmount] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/Member")
      .then((response) => response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/GroupSavings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          savings_type: "GROUP",
          Minamount: Number(Minamount),
          member_Ids: selectedMembers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Group savings "${data.name}" created successfully!`);
        setGroupName("");
        setMinAmount(0);
        setSelectedMembers([]);
      } else {
        setMessage("Failed to create group savings.");
      }
    } catch (error) {
      console.error("Error creating group savings:", error);
      setMessage("Failed to create group savings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Create Group Savings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Minimum Amount
            </label>
            <input
              type="number"
              value={Minamount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter initial amount"
              required
            />
          </div>

          {/* Members Multi-Select */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Select Members
            </label>
            <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
  {members.map((m) => (
    <label
      key={m.member_Id}
      className="flex items-center space-x-2 py-1 cursor-pointer"
    >
      <input
        type="checkbox"
        value={m.member_Id}
        checked={selectedMembers.includes(m.member_Id)}
        onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedMembers((prev) =>
            e.target.checked ? [...prev, id] : prev.filter((x) => x !== id)
          );
        }}
        className="accent-blue-600"
      />
      <span className=" text-gray-700">
        {m.firstName} {m.lastName}
        
      </span>
    </label>
  ))}
</div>

            <p className="text-sm text-gray-900 mt-1">
              Hold <kbd className="px-1 bg-gray-200 rounded">Ctrl</kbd> (Windows)
              or <kbd className="px-1 bg-gray-200 rounded">Cmd</kbd> (Mac) to
              select multiple members.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group Savings"}
          </button>

          {/* Feedback */}
          {message && (
            <p className="mt-4 text-center font-medium text-green-600">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
