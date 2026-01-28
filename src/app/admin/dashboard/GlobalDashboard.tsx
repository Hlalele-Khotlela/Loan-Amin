"use client";
import { useEffect, useState } from "react";
import type { SafeDashboardData } from "@/lib/dashboard/aggregation";
import Link from "next/link";
import LoanSavingsCharts from "./LoanSavingCharts";
import CooporateSummary from "@/components/coporateEarningsSummary";
import { CooporateTypes } from "@/types/CooporateTypes";




type LoanByTypeAndStatus = { 
  loan_type: string; 
  status: string; 
  _sum: { 
    Principal: number | null; 
    balance: number | null; 
    intrests: number | null; 
    totals_payeable: number | null;
   }; 
   _count: { 
    loan_id: number 
  }; 
  }; 
  
  type SavingsByStatus = { 
    status: string;
     _sum: { 
      amount: number | null; 
      total: number | null; 
      interest: number | null; 
    }; 
    _count: { 
      savings_id: number };
     };

     type DashboardData = { loansByTypeAndStatus: LoanByTypeAndStatus[]; savingsByStatus: SavingsByStatus[]; };

export default function GlobalDashboard({ data }: { data?: SafeDashboardData }) {
   const [earnings, setEarnings] = useState<CooporateTypes | null>(null); 
   const [loading, setLoading] = useState(true);

   useEffect(() =>{
    async function fetchEarnings() {
      try{
        const res = await fetch(`/api/Owner/Earnings`);
        const data = await res.json();
        setEarnings(data);
      }catch (error){
        console.error("Error Fetching owner Earnings: ", error);
      } finally{
        setLoading(false)
      }
      
    }
    fetchEarnings();
   }, []);
   if (loading) return <p>Loading Earnings....</p>
  //  if(!earnings) return<p>No earnings data available</p>
  return (
    
    
    <div className=" mx-3">
      <CooporateSummary cooporate={earnings}/>
      <div className="grid lg:grid-cols-3 lg:gap-x-4 lg:my-3 lg:mt-12">
        
        <Link className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
            <h2 className="text-lg font-semibold">Loans</h2>
            <p>Total Borrowed: {data?.loans._sum.Principal?.toString() ?? "0"}</p>
      <p>Total Payable: {data?.loans._sum.totals_payeable?.toString() ?? "0"}</p>
      <p>Outstanding Balance: {data?.loans._sum.balance?.toString() ?? "0"}</p>

      <p>Number of Loans: {data?.loans._count.loan_id}</p>


        {data?.loansByTypeAndStatus.map((loan)=>(
          <div key={`${loan.loan_type}`} className="mb-2">
            <h3 className="text-lg font-semibold">{loan.loan_type}</h3>
             <p>Principal: {loan._sum.Principal ?? 0}</p>
            <p>Balance: {loan._sum.balance ?? 0}</p>
            <p>Interest: {loan._sum.intrests ?? 0}</p>
            <p>Total Payable: {loan._sum.totals_payeable ?? 0}</p>
            <p>Number of Loans: {loan._count.loan_id}</p>
          </div>
          
        ))}
        </Link>
      
      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
      <h2 className="text-lg font-semibold">Savings</h2>
      <p>Total Savings: {data?.savings._sum.amount?.toString() ?? "0"}</p>
      <p>Total Savings aft Int: {data?.savings._sum.total?.toString() ?? "0"}</p>
      <p>Number of Accounts: {data?.savings._count.savings_id}</p>
      {data?.savingsByStatus.map((savings, index)=>(
        <div key={`${savings.savings_type ?? "unknown"}-${index}`} className="mb-2">
          <h3 className="text-lg font-semibold">{savings.savings_type}</h3>
          <p>Total Savings: {savings._sum.amount}</p>
        </div>
      ))}
      </Link>

      {/* <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
       <h2 className="text-lg font-semibold">Loan Transactions</h2>
      {data?.loanTransactions.map((tx:any) => (
        <p key={tx.type}>
         Total {tx.type}: {tx._sum.amount?.toString() ?? "0"}
        </p>
      ))}
      </Link> */}

      {/* <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
      <h2 className="text-lg font-semibold">Group Transactions</h2>
      {data?.groupTransactions.map((tx:any) => (
        <p key={tx.type}>
          {tx.type}: {tx._sum.amount?.toString() ?? "0"}
        </p>
      ))}
      </Link> */}

      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition " href="#" >
      <h2 className="text-lg font-semibold">Group</h2>
      
        <p>Total Group Amount: {data?.groups._sum.amount?.toString() ?? "0"}</p>
         <p>Number of Groups: {data?.groups._count.group_id ?? 0}</p>
        
     
      </Link>

      {/* <Link className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition my-6" href="#">
        <h2 className="text-lg font-semibold">Savings Transactions</h2>

        {data?.savingsSummary.map((sx:any) => (
        <p key={sx.type}>
          {sx.type}: {sx._sum.amount?.toString() ?? "0"}
        </p>
      ))}

      </Link> */}
      
      <LoanSavingsCharts
      loansByTypeAndStatus={data?.loansByTypeAndStatus ?? []}
      savingsByStatus={data?.savingsByStatus ?? []}
      />

      
    </div>
    </div>
  );
}

