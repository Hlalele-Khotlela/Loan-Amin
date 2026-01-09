'use client';

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SavingsActions() {
  async function handleApplyInterest() {
    await fetch("/api/apply-savings-interest", {method: "POST"});

    toast({
      title: "Interest Applied",
      description: "savings interest have been successfully applied.",
      duration: 5000,
    });
    // Implement logic to apply interest
  }
  const router = useRouter();

  return (
    <div className="flex gap-4 bg-white p-6 rounded-xl">
      <div>
        

        <button
          onClick={handleApplyInterest}
          className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Apply Intrest
        </button>

        <button
          onClick={()=> router.push("/admin/savings")}
          className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create New Savings
        </button>

        

     
      </div>
    </div>
  );
}
