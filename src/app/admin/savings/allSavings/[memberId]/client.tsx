"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import  {prisma} from "../../../../../lib/prisma/prisma";
import Link from "next/link";

import { usePermission } from "@/hooks/usePermission";
interface Saving {
  savings_id: number;
  member_Id: number;
  savings_type: string;
  amount: any;       // or Decimal if you imported it
  total: any;        // same here
  started_at: Date;
}

interface ClientSavingsPageProps {
  savings: Saving[];
  id: number;
}

export default function ClientSavingsPage({ savings, id }: ClientSavingsPageProps) {
  const { canManageStaff, canApproveLoans, canViewReports } = usePermission();

  return (
    <div>
       <button>Approve</button>
      <div className="flex gap-2">
            

            <Card className="shadow-lg flex-auto">
                <CardHeader>Individual Savings for {id}</CardHeader>

                <CardContent>
                    {savings.length===0? (
                        <p>No Savings available</p>
                    ) : (
                        <table className="w-full border-collapse mt-4">
                            <thead>
                                <tr>
                                    
                                    <th className="border px-2 py-1">Type</th>
                                    <th className="border px-2 py-1">Amount</th>
                                    <th className="border px-2 py-1">Balance</th>
                                    <th className="border px-2 py-1">Created at</th>
                                    <th className="border px-2 py-1">More</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savings.map((saving)=> (
                                    <tr key={saving.savings_id}>
                                        
                                        <td className="border px-2 py-1">{saving.savings_type}</td>
                                        <td className="border px-2 py-1">{saving.amount.toString()}</td>
                                        <td className="border px-2 py-1">{saving.total.toString()}</td>
                                        <td className="border px-2 py-1">{saving.started_at.toLocaleDateString()}</td>
                                        <td className="border px-2 py-1">
                                            
                                            <Link href={`/admin/savings/allSavings/${saving.member_Id}/${saving.savings_id}/`}  className="text-green-600">
                                              View 
                                              </Link>
                                             
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>

            </Card>
        </div>
    </div>
  );
}
