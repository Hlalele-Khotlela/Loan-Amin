export type Role = "Admin" | "Staff" | "User"| "CreditMember"| "Audit";

export const Permissions: Record<Role, {
  canViewAdminDashboard: boolean;
  canManageStaff: boolean;
  canViewSavings: boolean;
  canViewLoans: boolean;
  canApproveLoans: boolean;
  canCommentOnLoans:boolean;
  canViewReports: boolean;
  canViewEmails: boolean;
  
}> = {
  Admin: {
    canViewAdminDashboard: true,
    canManageStaff: true,
    canViewSavings: true,
    canViewLoans: true,
    canCommentOnLoans: false,
    canApproveLoans: true,
    canViewReports: true,
    canViewEmails: true,
  },

  Staff: {
    canViewAdminDashboard: false,
    canManageStaff: false,
    canViewSavings: true,
    canViewLoans: true,
    canCommentOnLoans: false,
    canApproveLoans: false,
    canViewReports: true,
    canViewEmails:false,
  },

   CreditMember: { 
    canViewAdminDashboard: true, 
    canManageStaff: false, 
    canViewSavings: true, 
    canViewEmails:false,
    canViewLoans: true, 
    canApproveLoans: false,
    canCommentOnLoans:true, 
    canViewReports: true, },

  User: {
    canViewAdminDashboard: false,
    canManageStaff: false,
    canViewSavings: true,
    canCommentOnLoans: false,
    canViewLoans: false,
    canApproveLoans: false,
    canViewReports: false,
    canViewEmails:false,
  },

   Audit: { 
    canViewAdminDashboard: true, 
    canManageStaff: false, 
    canViewSavings: true, 
    canViewLoans: true, 
    canApproveLoans: false,
    canViewEmails:false,
    canCommentOnLoans:false, 
    canViewReports: true, },
};
