"use client";
import { AdminNav } from "@/components/admin-nav";
import Link from "next/link";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
     <div className="flex flex-col min-h-screen my-4"> 
     {/* 🔝 Top Menu */}
      
              {/* 📌 Main Layout with Sidebar */}
               <div className="flex flex-1 p-8">
                 {/* Sidebar Navigation */}
                  <AdminNav />
                   {/* Main content area */}
                   <div className="flex-1 p-6 bg-gray-50">
                    {children}
                    </div> 
                   </div>
                    </div>
  );
}
