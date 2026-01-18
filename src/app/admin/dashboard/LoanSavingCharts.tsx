// src/app/admin/dashboard/LoanSavingsCharts.tsx
"use client";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type LoanByTypeAndStatus = {
  loan_type: string;
  status: string;
  _sum: { Principal: number | null };
};

type SavingsByStatus = {
  status: string;
  _sum: { amount: number | null };
};

export default function LoanSavingsCharts({
  loansByTypeAndStatus,
  savingsByStatus,
}: {
  loansByTypeAndStatus: LoanByTypeAndStatus[];
  savingsByStatus: SavingsByStatus[];
}) {
  // Grouped bar chart for loans
  const loanTypes = [...new Set(loansByTypeAndStatus.map((l) => l.loan_type))];
  const statuses = [...new Set(loansByTypeAndStatus.map((l) => l.status))];

  const loanData = {
    labels: loanTypes,
    datasets: statuses.map((status) => ({
      label: status,
      data: loanTypes.map((type) => {
        const entry = loansByTypeAndStatus.find(
          (l) => l.loan_type === type && l.status === status
        );
        return entry?._sum.Principal ?? 0;
      }),
      backgroundColor:
        status === "ACTIVE" ? "rgba(75,192,192,0.6)" : "rgba(255,99,132,0.6)",
    })),
  };

  // Pie chart for savings
  const savingsData = {
    labels: savingsByStatus.map((s) => s.status),
    datasets: [
      {
        data: savingsByStatus.map((s) => s._sum.amount ?? 0),
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-6 my-6">
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Loans by Type & Status</h2>
        <Bar data={loanData} />
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Savings by Status</h2>
        <Pie data={savingsData} />
      </div>
    </div>
  );
}
