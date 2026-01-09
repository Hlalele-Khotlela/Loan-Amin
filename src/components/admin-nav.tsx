"use client";

import Link from 'next/link';
import { Home, UserPlus, PiggyBank, FileSliders } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';


export function AdminNav() {
  const [loading, setLoading]= useState(false);

 

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

          <Link href="/admin/savings/allSavings" className='w-full mt-4 block'>
          <PiggyBank className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'> Savings</span>  
          </Link>

          <Link href="/admin/dashboard/groups" className='w-full mt-4 block'>
          <FileSliders className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Groups Savings</span>  
          </Link>

          <Link href="/admin/members" className='w-full mt-4 block'>
          <FileSliders className='inline-block mr-2 h-4 w-4 text-primary' />
          <span className='font-medium'>Members</span> 
          
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
       
      </div>);
}