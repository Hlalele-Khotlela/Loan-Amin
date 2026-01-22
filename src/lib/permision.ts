export type Role = "Admin" | "Staff" | "User";
export const Permissions: Record<Role, {
  canViewAdminDashboard: boolean;
  canManageStaff: boolean;
  canViewSavings: boolean;
  canViewLoans: boolean;
  canApproveLoans: boolean;
  canViewReports: boolean;
}> = {
  Admin: {
    canViewAdminDashboard: true,
    canManageStaff: true,
    canViewSavings: true,
    canViewLoans: true,
    canApproveLoans: true,
    canViewReports: true,
  },

  Staff: {
    canViewAdminDashboard: false,
    canManageStaff: false,
    canViewSavings: true,
    canViewLoans: true,
    canApproveLoans: false,
    canViewReports: true,
  },

  User: {
    canViewAdminDashboard: false,
    canManageStaff: false,
    canViewSavings: true,
    canViewLoans: false,
    canApproveLoans: false,
    canViewReports: false,
  },
};
