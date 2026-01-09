import type { DashboardData } from "@/lib/dashboard/aggregation";
import Link from "next/link";

export default function GlobalDashboard({ data }: { data?: DashboardData }) {
  return (
    <div className="grid grid-cols-4 gap-x-4 my-3">
        <Link className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
            <h2 className="text-lg font-semibold">Loans</h2>
            <p>Total Borrowed: {data?.loans._sum.Principal?.toString() ?? "0"}</p>
      <p>Total Payable: {data?.loans._sum.totals_payeable?.toString() ?? "0"}</p>
      <p>Outstanding Balance: {data?.loans._sum.balance?.toString() ?? "0"}</p>
      <p>Number of Loans: {data?.loans._count.loan_id}</p>
        
        </Link>
      
      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
      <h2 className="text-lg font-semibold">Savings</h2>
      <p>Total Savings: {data?.savings._sum.amount?.toString() ?? "0"}</p>
      <p>Total Savings aft Int: {data?.savings._sum.total?.toString() ?? "0"}</p>
      <p>Number of Accounts: {data?.savings._count.savings_id}</p>
      </Link>

      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
       <h2 className="text-lg font-semibold">Loan Transactions</h2>
      {data?.loanTransactions.map((tx) => (
        <p key={tx.type}>
         Total {tx.type}: {tx._sum.amount?.toString() ?? "0"}
        </p>
      ))}
      </Link>

      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition" href="#">
      <h2 className="text-lg font-semibold">Group Transactions</h2>
      {data?.groupTransactions.map((tx) => (
        <p key={tx.type}>
          {tx.type}: {tx._sum.amount?.toString() ?? "0"}
        </p>
      ))}
      </Link>

      <Link className=" p-4 bg-white shadow rounded-lg border hover:shadow-md transition my-6" href="#" >
      <h2 className="text-lg font-semibold">Group</h2>
      
        <p>Total Group Amount: {data?.groups._sum.amount?.toString() ?? "0"}</p>
         <p>Number of Groups: {data?.groups._count.group_id ?? 0}</p>
        
     
      </Link>

      <Link className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition my-6" href="#">
        <h2 className="text-lg font-semibold">Savings Transactions</h2>

        {data?.savingsSummary.map((sx) => (
        <p key={sx.type}>
          {sx.type}: {sx._sum.amount?.toString() ?? "0"}
        </p>
      ))}

      </Link>



      

     

      
    </div>
  );
}

//   href={`/admin/dashboard/groups/${group.group_id}`}
//       className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition"
//     >
//       <h2 className="text-lg font-semibold">{group.name}</h2>
//       <p className="text-sm text-gray-600">Type: {group.savings_type}</p>
//       <p className="text-sm text-gray-600">
//         Starting Amount: R {Number(group.amount).toFixed(2)}
//       </p>
//       <p className="text-sm text-gray-600">
//         Total Savings: R {Number(group.total_Savings).toFixed(2)}
//       </p>
//     </Link>
