"use client";

import {DepositModal} from "@/components/deposit-modal";
import SavingsActions from "@/components/savins-acts";

import { useEffect, useState } from "react";

type Savings = {
  savings_id: number;
  member_Id: number;
  savings_type: string;
  amount: number;
  interest: number;
  started_at: string;
  total: number;
};



export default function SavingsTable() {
  const [Savings, setSavings] = useState<Savings[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
const [selectedSavingsId, setSelectedSavingsId] = useState<number | null>(null);


  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const res = await fetch(`/api/Savings/allSavings`);
        if (res.ok) {
          const data = await res.json();
          setSavings(data);
        }
      } catch (error) {
        console.error("Error fetching savings:", error);
      }
    };
    fetchSavings();
  }, []);

  return (
    <div className="p-6">
      

      <h2 className="text-xl font-bold mb-4">Savings Accounts</h2>
      <SavingsActions />
      

      <table className="min-w-full border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Savings ID</th>
            <th className="px-4 py-2 border">Member </th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Interest</th>
            <th className="px-4 py-2 border">Total</th>
            <th className="px-4 py-2 border">Started At</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Savings.length > 0 ? (
            Savings.map((s) => (
              <tr key={s.savings_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{s.savings_id}</td>
                <td className="px-4 py-2 border">{s.member_Id}</td>
                <td className="px-4 py-2 border">{s.savings_type}</td>
                <td className="px-4 py-2 border">{s.amount}</td>
                <td className="px-4 py-2 border">{s.interest}</td>
                <td className="px-4 py-2 border">{s.total}</td>
                <td className="px-4 py-2 border">
                  {new Date(s.started_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  <button 
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedSavingsId(s.savings_id);
                  }}
                  className="text-blue-600 hover:underline mr-2">
                  Deposit  
                    </button>
                    {selectedSavingsId !== null && (
                      <DepositModal
                        savingsId={selectedSavingsId}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />)}

                    {/* <DepositModal
                        savingsId={selectedSavingsId}
                        
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    /> */}
                    
                    <button className="text-green-600 hover:underline mr-2">
                    Withdraw
                    </button>

                 </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center px-4 py-6 text-gray-500 italic"
              >
                No savings accounts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
