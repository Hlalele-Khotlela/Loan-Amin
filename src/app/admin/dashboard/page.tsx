import { allLoansData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/status-badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PiggyBank, Landmark, TrendingUp, UserPlus,FileSliders, Home, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin-nav';


export default function AdminDashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LS', {
      style: 'currency',
      currency: 'LSL',
    }).format(amount);
  };

  return (
    <div className='flex gap-2'>
      <AdminNav />
      
    <Card className="shadow-lg flex-auto">
     
      <CardHeader>
        <CardTitle>User Financial Overview</CardTitle>
        <CardDescription>A comprehensive overview of all users' loans and savings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {allLoansData.map((user) => (
            <AccordionItem value={user.id} key={user.id}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                  <span className="font-medium text-lg">{user.applicantName}</span>
                  <div className='flex items-center gap-8'>
                    <div className='text-right'>
                      <p className="text-sm text-muted-foreground">Total Loans</p>
                      <p className="font-semibold">{formatCurrency(user.amount)}</p>
                    </div>
                    <div className='text-right'>
                      <p className="text-sm text-muted-foreground">Total Savings</p>
                      <p className="font-semibold">{formatCurrency(user.savings.total)}</p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/40 rounded-lg">
                  
                  {/* Loan Details */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-md font-semibold">Loan Details</CardTitle>
                      <Landmark className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Loan ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>{user.id}</TableCell>
                            <TableCell><StatusBadge status={user.status} /></TableCell>
                            <TableCell className="text-right">{formatCurrency(user.amount)}</TableCell>
                          </TableRow>
                        </TableBody>
                       </Table>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground w-full text-right">Outstanding Balance: <span className="font-bold text-foreground">{formatCurrency(user.outstandingBalance)}</span></p>
                    </CardFooter>
                  </Card>

                  {/* Savings Details */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-md font-semibold">Savings Details</CardTitle>
                      <PiggyBank className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(user.savings).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-sm">
                            <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="font-medium">{formatCurrency(value as number)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
    </div>
  );
}
