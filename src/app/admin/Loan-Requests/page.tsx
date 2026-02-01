"use client";
import React from 'react';
import { AdminNav } from '@/components/admin-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Link } from 'lucide-react';
import { Form } from "@/components/ui/form";
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { LOANTYPE } from '@prisma/client';
import { usePermission } from '@/hooks/usePermission';

const loanTypeOptions = [
   { label: "Emergency", value: LOANTYPE.EMERGENCY },
    { label: "Short-term", value: LOANTYPE.SHORT_TERM },
     { label: "Long-term", value: LOANTYPE.LONG_TERM }, 
    ];

const formSchema = z.object({
  loanStatus: z.enum(["Reject", "Accept"], {
    required_error: "Please select a response.",
  }),

});

interface LoanRequest {
  id: string;
  applicant: string;
  amount: number;
  loan_type: string;
  balance: number;
  status: "pending" | "approved" | "rejected";
}
// fecth loan requests from database and display them in a table with approve/reject options

type LoanRequests = {
  request_id: number;
  applicant: string;
  loan_type: string;
  amount: number;
};



export default function loansrequests() {
   
  const router = useRouter();
  //  const loanRequests = fetchLoanRequests();
  const [myloanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<{[id: string]: string}>({});
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(15);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  



  // debounce search input 
  useEffect(() =>{
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  } , [searchTerm]);

  useEffect(() => {
  if (page > totalPages) {
    setPage(totalPages);
  }
}, [totalPages]);


  useEffect(() => {
    // reset to first page on filter/search change
    const fetchLoanRequests = async ()=> {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (selectedType && selectedType !== "all") {
        params.append("selectedType", selectedType);
      }

      if (debouncedSearch.trim() !== "") {
        params.append("search", debouncedSearch);
      }

      const res= await fetch(`/api/LoanRequests?${params.toString()}`);
      const data = await res.json();
      // debug to see the outcome
      console.log("Api response: ", data);

      setTotalPages(data.pagination?.totalPages ?? 1);
      //setTotalPages(Math.ceil(data.totalCount / limit));
      setLoanRequests(Array.isArray(data.data) ? data.data : []);

      if(Array.isArray(data.data)){
        setLoanRequests(data.data);
      }else if (Array.isArray(data.loanRequest)){
        setLoanRequests(data.loanRequests);
      }else if(Array.isArray(data)){
        setLoanRequests(data);
      }
      else{
        setLoanRequests(Array.isArray(data) ? data : []);
      }
    };
    fetchLoanRequests()
  }, [page, selectedType, debouncedSearch]);
 
 console.log("API response data:", myloanRequests);


  const handlechange= (id: string, newStatus: string) => {
    setStatus((prev) => ({ ...prev, [id]: newStatus }) );
    console.log("Changed status to:", newStatus);
  }

  // handle form submission for each loan request
  const handleSubmit= async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting status changes:", status); 
    try {
      for (const [request_id, newstatus] of Object.entries(status)) {
        const response = await fetch(`/api/LoanRequests/updater/${request_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          
          body: JSON.stringify({ status: newstatus }),
        });
        console.log("Submitting status changes:", status);


      if (response.ok) {
        toast({
          title: "Response Submitted!",
          description: "Loan request status has been updated.",
        });
        const res = await fetch(`/api/LoanRequests?page=${page}&limit=${limit}`);
        const data = await res.json();
        setLoanRequests(Array.isArray(data.data) ? data.data : []);
      } else {
        toast({
          title: "Error",
          description: "Failed to update loan request status.",
        });
      }
      }
    } catch (error) {
      console.error("Error submitting status changes:", error);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      loanStatus: "Accept",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Loan Request Response Submitted:", values);

    toast({
      title: "Response Submitted!",
      description: `You have ${values.loanStatus}ed the loan request.`,
    });
    router.push("/admin/dashboard");
  }

  return (
    <div className='flex gap-2'>
      

      <Card className="shadow-lg flex-auto">
        <CardHeader>
          <div className="float mb-4 text-right" >
            
            <input
              type="text"
              placeholder="Search Loan Requests..."
              value={searchTerm}
              className="border border-gray-300 rounded px-2 py-1"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          

            <label className="ml-4 mr-2" htmlFor="filterDropdown">Filter by</label>
            <select
              id="filterDropdown"
              className="border border-gray-300 rounded px-2 py-1"
              // onchange="filterTable()"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as LOANTYPE)}
            >
                <option value="all">Show All</option>
  {loanTypeOptions.map(opt => (
    <option key={opt.value} value={opt.value}>
      {opt.label}
    </option>
  ))}
              
            </select>


          </div>
          <CardTitle>Loan Requests</CardTitle>
          <CardDescription>These are the current loan requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">


              <table className="w-full">

                <thead>
                  <tr className="text-left border-b">

                    <th className="py-2">Applicant</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Loan Type</th>
                    <th className="py-2">Request Type</th>
                    <th className="py-2">View</th>
                    
                  </tr>
                </thead>
                <tbody>



                 {myloanRequests.map((request: any) => (
                    <tr key={request.request_id} className="border-b">
                      <td className="py-2">{request.applicant}</td>
                      <td className="py-2">L{request.amount}</td>
                      <td className="py-2">{request.status}</td>
                      <td className="py-2">{request.loan_type}</td>
                      <td className="py-2"> {request.type}</td>
                      <td className="py-2">
                       
                        
                         

                          {/* view  details */}
                          <button
                            type="button"
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                            onClick={() => router.push(`/admin/Loan-Requests/${request.request_id}`)}
                          >
                            View Details
                          </button>

                        
                      </td>
                    </tr>))}

                </tbody>

              </table>
              <div className="flex items-center justify-between mt-4">
  <button
    disabled={page === 1}
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    className="px-4 py-2 border rounded disabled:opacity-50"
  >
    Previous
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    className="px-4 py-2 border rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
            </form>
          </Form>
        </CardContent>

      </Card>



    </div>
  );
}