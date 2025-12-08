import { userLoanData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Landmark, FileText, PlusCircle } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UserDashboardPage() {
  const { outstandingBalance, applications } = userLoanData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LS', {
      style: 'currency',
      currency: 'LSL',
    }).format(amount);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/apply">
            <PlusCircle className="mr-2 h-4 w-4" />
            Apply for New Loan
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <Landmark className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatCurrency(outstandingBalance)}</div>
            <p className="text-xs text-muted-foreground pt-2">
              Next payment due on {new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Your Loan Applications</CardTitle>
            </div>
            <CardDescription>Review the status of your recent loan applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flow-root">
              <ul role="list" className="-mb-4">
                {applications.map((application, index) => (
                  <li key={application.id}>
                    <div className="relative pb-4">
                      {index !== applications.length - 1 ? (
                        <span className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-center space-x-3">
                        <div>
                          <StatusBadge status={application.status} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">
                            Application #{application.id} for <span className="font-bold">{formatCurrency(application.amount)}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted on {new Date(new Date().setDate(new Date().getDate() - (index + 1) * 7)).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
