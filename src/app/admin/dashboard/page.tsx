// src/app/admin/dashboard/page.tsx
import GlobalDashboard from "./GlobalDashboard";
import { getGlobalDashboardData } from "@/lib/dashboard/aggregation";

export default async function DashboardPage() {
  const data = await getGlobalDashboardData(); // fetch Prisma aggregates

  return <GlobalDashboard data={data} />;
}
