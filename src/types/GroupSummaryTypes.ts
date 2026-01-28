
export type GroupMemberWithTotals = {
  member_Id: string;
  name: string;
  firstName: string;
  lastName: string;
  totalDeposited: number;
  totalWithdrawn: number;
  balance: number;
};



export interface GroupSummaryType {
  group_id: number;
  name: string;
  savings_type: string;
  

  // Prisma Decimal comes through as string in JSON
  amount: string | number;
  total_Savings: string | number;

  // Computed on the frontend or API
  current_total?: number;
  interest? :number;

  // Optional nested data for dashboard
  members: GroupMemberWithTotals[];
  deposits?: DepositType[];
  withdrawals?: WithdrawalType[];
}

export interface MemberType {
  member_Id: number;
  firstName: string;
  lastName: string;
  balance:number;
  totalWithdrawn: number;
  totalDeposited:number;
}

export interface DepositType {
  deposit_id: number;
  amount: string | number;
  member_Id: number;
  group_id: number;
  created_at: string;
}

export interface WithdrawalType {
  withdrawal_id: number;
  amount: string | number;
  member_Id: number;
  group_id: number;
  created_at: string;
}
