// src/app/admin/dashboard/page.tsx
"use server";
import GlobalDashboard from "./GlobalDashboard";
import { getGlobalDashboardData } from "@/lib/dashboard/aggregation";
import {aggregateOwnerEarnings} from "@/lib/OwnerAgg/route";
import { decimalToPlain } from "@/lib/utilities/decimalToPlain";

export default async function DashboardPage() {

  const safeData = await getGlobalDashboardData(); // fetch Prisma aggregates

  // const safeData = decimalToPlain(data)
  console.log(JSON.stringify(safeData, null, 2));
  // const OwnerAgg = await aggregateOwnerEarnings();

  return <GlobalDashboard data={safeData} />;
}
