//Modal for deleting and Edditing Loan
import React, { useState } from "react";

type LoanModalProps = {
  loan: any;
  mode: "edit" | "delete";
  onClose: () => void;
  onConfirm: (updatedLoan: any) => void;
};

export function LoanModal({ loan, mode, onClose, onConfirm }: LoanModalProps) {
  const [formData, setFormData] = useState({
    Principal: loan.Principal,
    
    instalment: loan.instalments,
    
    interest: loan.intrests,
    duration: loan.Loan_Duration,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
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
              onConfirm({ ...loan, ...formData });
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Principal</label>
              <input
                type="number"
                name="Principal"
                value={formData.Principal}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Total Paid</label>
              <input
                type="number"
                name="instalment"
                value={formData.instalment}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Interest</label>
              <input
                type="number"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Duration</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
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
              Are you sure you want to delete Loan #{loan.loan_id}?  
              Principal: R {loan.Principal} | Balance: R {loan.balance}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                Cancel
              </button>
              <button
                onClick={() => onConfirm(loan)}
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
