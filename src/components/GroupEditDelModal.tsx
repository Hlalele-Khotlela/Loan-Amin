"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";

const GroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  members: z.array(z.number()).min(1, "A group must have at least one member"),
});

type Member = {
  member_Id: number;
  firstName: string;
  lastName: string;
};

type Group = {
  group_id: number;
  name: string;
  members: Member[];
};

type Props = {
  group: Group;
  allMembers: Member[];
  onConfirm: (updated: any) => void;
  onClose: () => void;
};

export default function GroupEditGroupModal({
  group,
  allMembers,
  onConfirm,
  onClose,
}: Props) {
  const [name, setName] = useState(group.name);
  const [members, setMembers] = useState<number[]>(
    group.members.map((m) => m.member_Id)
  );
  const [selectedMember, setSelectedMember] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute available members (not in group)
  const availableMembers = useMemo(
    () => allMembers.filter((m) => !members.includes(m.member_Id)),
    [allMembers, members]
  );

  const handleAddMember = () => {
    if (!selectedMember) return;

    const id = Number(selectedMember);
    setMembers((prev) => [...prev, id]);
    setSelectedMember("");
    setErrors((prev) => ({ ...prev, members: "" }));
  };

  const handleRemoveMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = GroupSchema.safeParse({ name, members });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    toast.success("Group updated successfully");

    onConfirm({
      group_id: group.group_id,
      name,
      members,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[450px] space-y-4">
        <h2 className="text-xl font-bold">Edit Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className="w-full border rounded px-2 py-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Members List */}
          <div>
            <label className="block text-sm font-medium">Members</label>
            <ul className="space-y-1">
              {group.members
                .filter((m) => members.includes(m.member_Id))
                .map((m) => (
                  <li
                    key={m.member_Id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <span>{m.firstName} {m.lastName}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.member_Id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </li>
                ))}
            </ul>

            {errors.members && (
              <p className="text-red-500 text-sm mt-1">{errors.members}</p>
            )}
          </div>

          {/* Add Member */}
          <div>
            <label className="block text-sm font-medium">Add Member</label>
            <div className="flex space-x-2">
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">Select member</option>
                {availableMembers.map((m) => (
                  <option key={m.member_Id} value={m.member_Id}>
                    {m.firstName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddMember}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
