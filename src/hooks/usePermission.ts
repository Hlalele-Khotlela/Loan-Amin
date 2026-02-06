"use client";

import { Permissions, Role } from "@/lib/permision";
import { useAuth } from "./useAuth";

export type PermissionSet = typeof Permissions["Admin"];

export function usePermission(): PermissionSet {
  const { user } = useAuth();

  if (!user?.role) {
    // return a safe default with all permissions false
    return {
      canViewAdminDashboard: false,
      canManageStaff: false,
      canViewSavings: false,
      canViewLoans: false,
      canApproveLoans: false,
      canViewReports: false,
      canCommentOnLoans:false,
    };
  }

  const role = user.role as Role;
  return Permissions[role];
}
