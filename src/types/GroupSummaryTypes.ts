export interface GroupSummaryType {
  group_id: number;
  name: string;
  savings_type: string;

  // Prisma Decimal comes through as string in JSON
  amount: string | number;
  total_Savings: string | number;

  // Computed on the frontend or API
  current_total?: number;

  // Optional nested data for dashboard
  members?: MemberType[];
  deposits?: DepositType[];
  withdrawals?: WithdrawalType[];
}

export interface MemberType {
  member_Id: number;
  firstName: string;
  lastName: string;
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
