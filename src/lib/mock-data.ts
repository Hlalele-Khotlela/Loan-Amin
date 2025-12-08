
export type LoanApplication = {
  id: string;
  amount: number;
  status: 'Approved' | 'Rejected' | 'Pending';
};

export type UserLoan = {
  outstandingBalance: number;
  applications: LoanApplication[];
};

export type AdminLoanView = {
  id: string;
  applicantName: string;
  amount: number;
  outstandingBalance: number;
  status: 'Approved' | 'Rejected' | 'Pending';
  savings: {
    total: number;
    compulsory: number;
    voluntary: number;
    pension: number;
    emergency: number;
    security: number;
    group: number;
    capitalShare: number;
  };
};

export type SavingsTransaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  category: 'compulsory' | 'voluntary' | 'pension' | 'emergency' | 'security' | 'group' | 'capitalShare';
};

export type UserSavings = {
  balance: {
    total: number;
    compulsory: number;
    voluntary: number;
    pension: number;
    emergency: number;
    security: number;
    group: number;
    capitalShare: number;
  };
  monthlyGoal: number;
  emergencyContribution: number;
  securityContribution: number;
  groupContribution: number;
  capitalShareContribution: number;
  transactions: SavingsTransaction[];
};

export const userLoanData: UserLoan = {
  outstandingBalance: 12530.75,
  applications: [
    { id: 'APP-1024', amount: 15000, status: 'Approved' },
    { id: 'APP-987', amount: 5000, status: 'Rejected' },
  ],
};

export const allLoansData: AdminLoanView[] = [
  { 
    id: 'LN-001', 
    applicantName: 'Rethabile Moloi', 
    amount: 15000, 
    outstandingBalance: 12530.75, 
    status: 'Approved',
    savings: { total: 11020.50, compulsory: 5000, voluntary: 2200.50, pension: 2000, emergency: 770, security: 50, group: 500, capitalShare: 500 }
  },
  { 
    id: 'LN-002', 
    applicantName: 'Sipho Ndlovu', 
    amount: 25000, 
    outstandingBalance: 25000.00, 
    status: 'Pending',
    savings: { total: 8500, compulsory: 4000, voluntary: 1500, pension: 1500, emergency: 500, security: 250, group: 250, capitalShare: 500 }
  },
  { 
    id: 'LN-003', 
    applicantName: 'Thabo Mokoena', 
    amount: 8000, 
    outstandingBalance: 0, 
    status: 'Rejected',
    savings: { total: 2500, compulsory: 2000, voluntary: 0, pension: 0, emergency: 0, security: 0, group: 0, capitalShare: 500 }
  },
  { 
    id: 'LN-004', 
    applicantName: 'Nomusa Dlamini', 
    amount: 50000, 
    outstandingBalance: 45200.10, 
    status: 'Approved',
    savings: { total: 25000, compulsory: 10000, voluntary: 5000, pension: 5000, emergency: 2000, security: 1000, group: 1500, capitalShare: 500 }
  },
  { 
    id: 'LN-005', 
    applicantName: 'Lindiwe Ngubane', 
    amount: 12000, 
    outstandingBalance: 12000.00, 
    status: 'Pending',
    savings: { total: 5320, compulsory: 3000, voluntary: 1000, pension: 500, emergency: 320, security: 0, group: 0, capitalShare: 500 }
  },
  { 
    id: 'LN-006', 
    applicantName: 'Aphiwe Khumalo', 
    amount: 3000, 
    outstandingBalance: 0.00, 
    status: 'Approved',
    savings: { total: 15000, compulsory: 8000, voluntary: 4000, pension: 1000, emergency: 500, security: 500, group: 500, capitalShare: 500 }
  },
];

export const userSavingsData: UserSavings = {
  balance: {
    total: 11020.50,
    compulsory: 5000.00,
    voluntary: 2200.50,
    pension: 2000.00,
    emergency: 770.00,
    security: 50.00,
    group: 500.00,
    capitalShare: 500.00,
  },
  monthlyGoal: 10000,
  emergencyContribution: 10,
  securityContribution: 50,
  groupContribution: 500,
  capitalShareContribution: 500,
  transactions: [
    { id: 'TRN-011', date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), description: 'New Member Capital Share', amount: 500, type: 'deposit', category: 'capitalShare' },
    { id: 'TRN-001', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), description: 'Monthly Savings', amount: 2500, type: 'deposit', category: 'compulsory' },
    { id: 'TRN-010', date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), description: 'Group Contribution', amount: 500, type: 'deposit', category: 'group' },
    { id: 'TRN-009', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), description: 'Security Contribution', amount: 50, type: 'deposit', category: 'security' },
    { id: 'TRN-005', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), description: 'Pension Contribution', amount: 1000, type: 'deposit', category: 'pension' },
    { id: 'TRN-007', date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), description: 'Emergency Fund', amount: 10, type: 'deposit', category: 'emergency' },
    { id: 'TRN-002', date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), description: 'Emergency Withdrawal', amount: 500, type: 'withdrawal', category: 'voluntary' },
    { id: 'TRN-003', date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), description: 'Paycheck Deposit', amount: 2700.50, type: 'deposit', category: 'voluntary' },
    { id: 'TRN-004', date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(), description: 'Monthly Savings', amount: 2500, type: 'deposit', category: 'compulsory' },
    { id: 'TRN-006', date: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(), description: 'Pension Contribution', amount: 1000, type: 'deposit', category: 'pension' },
    { id: 'TRN-008', date: new Date(new Date().setDate(new Date().getDate() - 27)).toISOString(), description: 'Emergency Fund', amount: 760, type: 'deposit', category: 'emergency' },
  ],
};
