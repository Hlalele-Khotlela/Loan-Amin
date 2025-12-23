"use client";

import Link from 'next/link';
import { Home, UserPlus, PiggyBank, FileSliders } from 'lucide-react';
import { useState } from 'react';


export function AdminNav() {
  const [loading, setLoading]= useState(false);

  async function applyIntrest(){
    setLoading(true);
    await fetch("/api/apply-Intrest", {method: "POST"});
    setLoading(false);
    alert("monthly intrest applied")
  }
  return ( 

<div className='w-64 flex-none shadow-lg bg-slate-200 rounded-lg border p-6'>
    
        <ul className='mt-3 '>

          <Link href="/admin/dashboard" className='w-full'>
          <Home className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Dashboard</span>  
          </Link>
          <Link href="/admin/register" className='w-full mt-4 block'>
          <UserPlus className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Member Registration</span>  
          </Link>
          <Link href="/admin/Loan-Requests" className='w-full mt-4 block'>
          <PiggyBank className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Loan Request</span>  
          </Link>

          <Link href="#" className='w-full mt-4 block'>
          <FileSliders className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Deposit Slips</span>  
          </Link>

          <Link href="/admin/Loans" className='w-full mt-4 block'>
          <FileSliders className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Loans</span>  
          </Link>
        </ul>
        <button
        onClick={applyIntrest}
        disabled={loading}
         className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'>Apply Monthly intrests</button>
         
      </div>);
}