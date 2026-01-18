"use client";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";
import { SavingsDetails } from "./savingDetails";
import { SavingsModal } from "@/components/SavingsEditDelModal";
export default function SavingsClient({savings}: {savings:any}){
      const [selectedSaving, setSelectedSaving] = useState<any | null>(null);
      const [selectedSavingsId, setSelectedSavingsId] = useState<number | null>(null);
      const [mode, setMode] = useState<"edit" | "delete" | null>(null);

async function handleConfirm(savings: any) {
          if(!selectedSavingsId) return;
     try{
       if (mode === "delete") {
      await fetch(`/api/Savings/${selectedSavingsId}`, { method: "DELETE" });
    } else if (mode === "edit") {
      await fetch(`/api/Savings/${selectedSavingsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savings),
      });
      toast.success("Saving updated successfully");
    }

     }
     catch (error){
      toast.error("Something went wrong");
     }      
   
    setSelectedSaving(null);
    setMode(null);
    setSelectedSavingsId(null)
    // TODO: refresh state or re-fetch loans



  }
  return(
     <div className="p-6">
      

      <h1 className="text-xl font-bold mb-4">
        Transactions for Saving #{savings.savings_id}
      </h1>
      {savings.length === 0 ?(
        <p>Saving Not Found</p>
      ):(
        <div className="space-y-4">
                    <div className="space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSaving(savings);                            
                            setSelectedSavingsId(savings.savings_id);
                            
                            setMode("edit");
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSaving(savings);
                            setSelectedSavingsId(savings.savings_id)
                            setMode("delete");
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </div>
                    <SavingsDetails savings={savings}/>
                  
                    </div>
      ) }

      {savings.transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        
        

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Transaction</th>
              <th className="px-4 py-2 border">Amount</th>
              
            </tr>
          </thead>
          <tbody>
            {savings.transactions.map((tx:any) => (
              <tr key={tx.id}>
                <td className="px-4 py-4 border">
                  {tx.created_at.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 border">{tx.type}</td>
                <td className="px-4 py-4 border">{tx.amount.toString()}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      )}
        {/* Modal */}
            {selectedSaving && mode && (
              <SavingsModal
                saving={selectedSaving}
                savingsId={selectedSavingsId}
                mode={mode}
                onClose={() => {setSelectedSaving(null);
                  setSelectedSavingsId(null);
                  setMode(null);
                }}
                onConfirm={handleConfirm}
              />
            )}
          
    </div>
    
  )
}