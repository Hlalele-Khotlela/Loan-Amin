import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { LogOut, User, PiggyBank, LayoutDashboard } from 'lucide-react';
import { NavLink } from '@/components/nav-link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10 shadow-sm">
        <nav className="flex w-full items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground sr-only sm:not-sr-only">LoanView</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <NavLink href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </NavLink>
            <NavLink href="/dashboard/savings">
              <PiggyBank />
              Savings
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="h-5 w-5" />
              <span>Welcome, User!</span>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </nav>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
