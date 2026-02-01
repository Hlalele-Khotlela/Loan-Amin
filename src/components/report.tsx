"use client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";

export default function ReportPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-01");

  async function handleDownloadPDF() {
    try {
      const res = await fetch(`/api/reports?month=${selectedMonth}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      const report = await res.json();

      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text(`Monthly Report - ${report.month}`, 10, 20);

      // Totals
      doc.setFontSize(12);
      doc.text(`Total Income: ${report.totalIncome}`, 10, 40);
      doc.text(`Total Expenses: ${report.totalExpenses}`, 10, 50);
      doc.text(`Net Balance: ${report.netBalance}`, 10, 60);

      // Income breakdown
      doc.text("Income Breakdown:", 10, 80);
      let y = 90;
      Object.entries(report.incomeByType).forEach(([type, amount]) => {
        doc.text(`${type}: ${amount}`, 15, y);
        y += 10;
      });

      // Expense breakdown
      doc.text("Expense Breakdown:", 10, y + 10);
      y += 20;
      Object.entries(report.expenseByType).forEach(([type, amount]) => {
        doc.text(`${type}: ${amount}`, 15, y);
        y += 10;
      });

      // Styled Transactions Table
      autoTable(doc, {
        startY: y + 20,
        head: [["Date", "Type", "Category", "Amount"]],
        body: [
          ...report.transactions.incomes.map((i: any) => [
            new Date(i.created_at).toLocaleDateString(),
            "Income",
            i.type,
            i.amount,
          ]),
          ...report.transactions.expenses.map((e: any) => [
            new Date(e.created_at).toLocaleDateString(),
            "Expense",
            e.type,
            e.amount,
          ]),
        ],
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: {
          fillColor: [22, 160, 133], // teal header
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [240, 240, 240] }, // light gray rows
        columnStyles: {
          0: { cellWidth: 40 }, // Date column
          1: { cellWidth: 30 }, // Type column
          2: { cellWidth: 50 }, // Category column
          3: { cellWidth: 30, halign: "right" }, // Amount column
        },
      });

      // Save file
      doc.save(`Monthly_Report_${report.month}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Monthly Report</h1>

      {/* Month selector */}
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border px-2 py-1 rounded"
      />

      {/* Download button */}
      <button
        onClick={handleDownloadPDF}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Download PDF
      </button>
    </div>
  );
}
