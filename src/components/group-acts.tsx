'use client';

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";


export default function GroupActs() {
  const router = useRouter();
  const { canApproveLoans, canManageStaff, canViewSavings } = usePermission();

  async function handleApplyInterest() {
    await fetch("/api/apply-group-intrest", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    toast({
      title: "Interest Applied",
      description: "Group savings interest have been successfully applied.",
      duration: 5000,
    });
  }

  return (
    <div className="flex gap-4 bg-white p-6 rounded-xl">
      <div>
        {canApproveLoans && (
          <button
            onClick={() => router.push("/admin/GroupSavings/GroupDeposit")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Deposit
          </button>
        )}
      </div>

      <div>
        {canApproveLoans && (
          <button
            onClick={() => router.push("/admin/GroupSavings/GroupWithdraw")}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Withdraw
          </button>
        )}

        {canApproveLoans && (
          <button
            onClick={handleApplyInterest}
            className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Interest
          </button>
        )}

        {canManageStaff && (
          <button
            onClick={() => router.push("/admin/GroupSavings")}
            className="mt-2 ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create New Group
          </button>
        )}
      </div>
    </div>
  );
}
