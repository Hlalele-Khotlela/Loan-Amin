//Modal for deleting and Edditing Loan
import { toast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { z } from "zod";
import { Toast } from "@radix-ui/react-toast";

type SavingsModalProps = {
  saving: any;
  mode: "edit" | "delete";
  savingsId: number | null;
  onClose: () => void;
  onConfirm: (updatedsaving: any) => void;
};


const SavingsSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  total: z.string().min(1, "Total is required"),
  interest: z.string().min(1, "Interest is required"),
  minAmount: z.string().min(1, "Minimum deposit is required"),
  type: z.enum(["SPECIAL", "COMPULSARY", "PENSION", "SECURITY", "VOLUNTARY",], {
    errorMap: () => ({ message: "Select a valid saving type" }),
  }),
});


export function SavingsModal({ saving, mode, onClose, onConfirm, savingsId }: SavingsModalProps) {
  const [formData, setFormData] = useState({
   amount: saving.amount?.toString() ?? "", 
   type: saving.savings_type || "SPECIAL", 

   minAmount: saving.min_amount?.toString() ?? "", 
   interest: saving.interest?.toString() ?? "", 
   total: saving.total?.toString() ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  // console.log("EDIT MODAL ID:", savingsId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({...prev, [name]: ""}))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Saving" : "Delete Saving"}
        </h2>

        {mode === "edit" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const result = SavingsSchema.safeParse(formData);
              if(!result.success){
                const fieldErrors: Record<string, string> = {};
                result.error.errors.forEach((err)=>{
                  const field = err.path[0];
                  fieldErrors[field] = err.message;
                });
                setErrors(fieldErrors);
    
                return;
              }
              setErrors({});
              toast({
                title: "Update Successfull",
                description: "Saving have been updated Successfully",
                duration: 5000
              })
              
              const data = result.data;
              const payload = {
                 ...saving, 
                 ...result.data, 
                amount: Number(data.amount), 
                interest: Number(data.interest), 
                total: Number(data.total), 
                min_amount: Number(data.minAmount), 
                savings_id: savingsId, };
              onConfirm(payload);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Total Saved</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
               {errors.total && (
                <p className="text-red-500 text-sm mt-1">{errors.total}</p>
              )}
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

               {errors.intrest && (
                <p className="text-red-500 text-sm mt-1">{errors.intrest}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Min Deposit</label>
              <input
                type="number"
                name="minAmount"
                value={formData.minAmount}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
               {errors.minAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.minAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Saving Type</label>
              <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full- border rounded px-2 py-1"
              >

                <option value="SPECIAL">Special</option>
                <option value="COMPULSARY">Compulsory</option>
                <option value="PENSION">Pension</option>
                <option value="SECURITY">Security</option>
                <option value="VOLUNTARY">Voluntary</option>         
  
              </select>
               {errors.interest && <p className="text-red-500 text-sm mt-1">{errors.interest}</p>}

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
              Are you sure you want to delete Saving #{saving.savings_id}?  
              Total: R {saving.amount} | Balance: R {saving.total}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
                Cancel
              </button>
              <button
  onClick={() => {
    onConfirm({ ...saving, savings_id: savingsId });
    toast({
      title: "Saving Deleted",
      description: `Saving #${saving.savings_id} has been deleted.`,
      duration: 5000,
    });
  }}
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
