"use client";
import { useState } from "react";

interface EditAccumulatedInterestModalProps {
  interestId: number;
  accumulated: number; // 👈 just a number now
  onClose: () => void;
  onSave: (updated: any) => void;
}

export default function EditAccumulatedInterestModal({
  interestId,
  accumulated,
  onClose,
  onSave,
}: EditAccumulatedInterestModalProps) {
  const [value, setValue] = useState(accumulated);

  const handleSubmit = async () => {
    const res = await fetch(`/api/memberInterest/${interestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ AccumulatedInterest: value }),
    });

    if (res.ok) {
      const updated = await res.json();
      onSave(updated);
      onClose();
    } else {
      alert("Failed to update interest");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Edit Accumulated Interest</h2>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full border rounded px-2 py-1 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
