//Modal for deleting and Edditing Loan
import React, { useState } from "react";

type MemberModalProps = {
  member: any;
  mode: "edit" | "delete"| null;
  onClose: () => void;
  onConfirm: (updatedLoan: any) => void;
};



export function MemberModal({ member, mode, onClose, onConfirm }: MemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    member_Id: member.member_Id,
    lastName: member.lastName,
    email: member.email,
    gender: member.gender,
    Role: member.Role,
    phone: member.phone
   
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: String(value),
    }));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Loan" : "Delete Loan"}
        </h2>

        {mode === "edit" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirm({ ...member, ...formData });
            }}
            className="space-y-4"
          >

             <div>
              <label className="block text-sm font-medium">Pass Book Number</label>
              <input
                type="text"
                name="member_Id"
                value={formData.member_Id}
                onChange={handleChange}
                readOnly
                className="w-full border rounded px-2 py-1"
              />
            </div>
          
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full- border rounded px-2 py-1"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
              name="Role"
              value={formData.Role}
              onChange={handleChange}
              className="w-full- border rounded px-2 py-1"
              >
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Audit">Audit</option>
                <option value="CreditMember">Credit</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <p>
              Are you sure you want to delete Member #{member.member_Id}?  
              First Name:  {member.firstName} | Last Name:  {member.lastname}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                Cancel
              </button>
              <button
                onClick={() => onConfirm(member)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
