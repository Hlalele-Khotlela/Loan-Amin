import type {Metadata} from 'next';
import '@/app/globals.css';

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'LoanView',
  description: 'Your trusted partner in financial solutions.',
};

// app/admin/Loans/layout.tsx
export default function LoansLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-6">
      {children}
    </section>
  );
}
