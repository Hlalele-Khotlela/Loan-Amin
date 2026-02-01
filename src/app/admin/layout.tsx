"use client";
import { Toaster } from "react-hot-toast";
import { AdminNav } from "@/components/admin-nav";
import Link from "next/link";
import adminTopBar from "@/components/adminTopBar";
import { useState } from "react";
export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = useState(false)
  return (
    
     <div className="flex flex-col min-h-screen my-4"> 
     {/* 🔝 Top Menu */}
      
              {/* 📌 Main Layout with Sidebar */}
               <div className="flex items-center p-4 md:hidden">
                 <button onClick={() => setOpen(true)}
                  className="text-2xl">
                  ☰
                  </button>
                  </div>
                  <div className="flex flex-1">

                      {/* Sidebar */}
                      <aside
                        className={`
                          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg
                          transform transition-transform duration-300
                          ${open ? 'translate-x-0' : '-translate-x-full'}
                          md:static md:translate-x-0
                        `}
                      >
                      {/* Sidebar Navigation */}
                      <AdminNav />
                      <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 md:hidden text-xl"
                      >
                        ✕
                      </button>
                      </aside>

                       {/* Overlay (mobile only) */}
                       {open && (

                      <div
                          className="fixed inset-0 bg-black/40 z-30 md:hidden"
                          onClick={() => setOpen(false)}
                        />
                      )}



                   {/* Main content area */}
                   <main className="flex-1 p-6 bg-gray-50 md:ml-54">
                    {children}
                    </main> 
                   </div>
                    </div>
                   
                    
  );
  
}
