import { userSavingsData } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PiggyBank, TrendingUp, TrendingDown, PlusCircle, Briefcase, ShieldAlert, Shield, Users, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SavingsPage() {
  const { balance, monthlyGoal, transactions, emergencyContribution, securityContribution, groupContribution, capitalShareContribution } = userSavingsData;
  const progress = (balance.compulsory / monthlyGoal) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LS', {
      style: 'currency',
      currency: 'LSL',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-LS', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold text-primary">{formatCurrency(balance.total)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Your total saved amount.
            </p>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compulsory Savings</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.compulsory)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Mandatory monthly savings.
            </p>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluntary Savings</CardTitle>
            <PiggyBank className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.voluntary)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Your extra savings.
            </p>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pension Savings</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.pension)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Your retirement funds.
            </p>
            </CardContent>
        </Card>

         <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Savings</CardTitle>
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.emergency)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Compulsory {formatCurrency(emergencyContribution)} per month.
            </p>
            </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Savings</CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.security)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Compulsory {formatCurrency(securityContribution)} per month.
            </p>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Group Savings</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.group)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                Monthly payment: {formatCurrency(groupContribution)}.
            </p>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-1 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capital Share</CardTitle>
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.capitalShare)}</div>
            <p className="text-xs text-muted-foreground pt-2">
                One-time contribution: {formatCurrency(capitalShareContribution)}.
            </p>
            </CardContent>
        </Card>
      
      <Card className="lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardTitle>Compulsory Savings Goal</CardTitle>
          <CardDescription>You've saved {progress.toFixed(0)}% of your {formatCurrency(monthlyGoal)} goal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-4" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(monthlyGoal)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A log of your recent savings activity.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-start mb-4">
                <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Voluntary Funds
                </Button>
            </div>
           <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          transaction.category === 'compulsory' ? 'secondary' : 
                          transaction.category === 'pension' ? 'default' : 
                          transaction.category === 'emergency' ? 'destructive' : 
                          transaction.category === 'security' ? 'default' :
                          transaction.category === 'group' ? 'default' :
                          transaction.category === 'capitalShare' ? 'default' : 'outline'
                        } 
                        className={`capitalize ${
                          transaction.category === 'pension' && 'bg-blue-600 hover:bg-blue-600/90'
                        } ${
                          transaction.category === 'security' && 'bg-green-700 hover:bg-green-700/90'
                        } ${
                          transaction.category === 'group' && 'bg-purple-600 hover:bg-purple-600/90'
                        } ${
                          transaction.category === 'capitalShare' && 'bg-orange-500 hover:bg-orange-500/90'
                        }`}
                      >
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${transaction.type === 'deposit' ? 'text-emerald-600' : 'text-destructive'}`}>
                        <div className="flex items-center justify-end">
                            {transaction.type === 'deposit' ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                            {formatCurrency(transaction.amount)}
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
