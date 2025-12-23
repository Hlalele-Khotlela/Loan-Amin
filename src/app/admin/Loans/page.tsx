"use client";
import React from 'react';
import { AdminNav } from '@/components/admin-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
// import { Link } from 'lucide-react';
import { Form } from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {  LOANTYPE } from "@prisma/client";
import { Decimal } from "decimal.js";
import Link from 'next/link';
import { PaymentModal } from "@/components/loan-modal";



interface Loan {
  loan_id: number; 
  name: string; 
  member_Id: number;
  created_at: Date;
  amount: Decimal;
  instalments: Decimal;
  intrests: Decimal; 
  loan_type: LOANTYPE; 
  totals: Decimal;
   balance: Decimal; 
  request_id: number;
  
}

export default function LoansPage() {
    const router = useRouter();
    //  const loanRequests = fetchLoanRequests();
    const [Loan, setLoan] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{[id: string]: string}>({});
    const [selectedType, setSelectedType] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(15);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);


    useEffect(()=>{
      const fetchLoans = async ()=> {
        // search
        const params = new URLSearchParams();
       params.append("page", page.toString());
       params.append("limit", limit.toString());

       if (selectedType && selectedType !== "all") {
         params.append("selectedType", selectedType);
       }

       if (debouncedSearch.trim() !== "") {
        params.append("search", debouncedSearch);
      }

      const res= await fetch(`/api/loans?${params.toString()}`);
      const data= await res.json();
      console.log("Api response: ", data);




       setTotalPages(data.pagination?.totalPages ?? 1);
       setTotalPages(Math.ceil(data.totalCount / limit));
       setLoan(Array.isArray(data.data) ? data.data : [])

       if(Array.isArray(data.data)){
        setLoan(data.data);
       }
       else if(Array.isArray(data.loan)){
        setLoan(data.loan);
       }else if(Array.isArray(data)){
        setLoan(data);
       }
       else{
        setLoan(Array.isArray(data) ? data :[]);
       }

    };
    fetchLoans()
  },  [page, selectedType, debouncedSearch]);
    
  return (
    <div className='flex gap-6'>    
        <AdminNav />
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Loans</CardTitle>
              <CardDescription>See all loans and their details</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loan content goes here */}
              <table className="w-full table-auto border-collapse border border-slate-400">
                <thead>
                  <tr>
                    <th className="border border-slate-300 px-4 py-2">Loan ID</th>
                    <th className="border border-slate-300 px-4 py-2">Name</th>
                    <th className="border border-slate-300 px-4 py-2">Amount</th>
                    <th className="border border-slate-300 px-4 py-2">Instalments</th>
                    <th className="border border-slate-300 px-4 py-2">Interests</th>
                    <th className="border border-slate-300 px-4 py-2">Loan Type</th>
                    <th className="border border-slate-300 px-4 py-2">Total</th>
                    <th className="border border-slate-300 px-4 py-2">Balance</th>
                    <th className="border border-slate-300 px-4 py-2">Make Payent</th>
                  </tr>
                </thead>
                <tbody>
                {Loan.map((request: any)=>(
                  <tr key={request.loan_id} className="border-b">
                    <td className="py-2 "><Link href={`/admin/Loans/${request.member_Id}/${request.loan_id}/transactions`}>{request.loan_id}</Link>
                      </td>
                    <td className="py-2">
                      <Link href={`/admin/Loans/${request.member_Id}`}>
                    {request.name}
                    </Link></td>
                    <td className="py-2">{request.amount}</td>
                    <td className="py-2">{request.instalments}</td>
                    <td className="py-2">{request.intrests}</td>
                    <td className="py-2">{request.loan_type}</td>
                    <td className="py-2">{request.totals}</td>
                    <td className="py-2">{request.balance}</td>
                    <td className="py-2">
                      <button
  type="button"
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  onClick={() => {
    setSelectedLoan(request);
    setIsModalOpen(true);
  }}
>
  Pay
  
</button>

 
</td>

                    

                  </tr>
                ))}

        {/* {isModalOpen && selectedLoan && (
  <PaymentModal 
  isOpen={isModalOpen}
  loan={selectedLoan}
   onClose={() => setIsModalOpen(false)} />
)} */}
                
                </tbody>    
                </table>
                     {isModalOpen && selectedLoan && (
  <PaymentModal 
  isOpen={isModalOpen}
  loan={selectedLoan}
   onClose={() => setIsModalOpen(false)} />
)}
            </CardContent>
          </Card>
        </div>
    </div>
    );

}