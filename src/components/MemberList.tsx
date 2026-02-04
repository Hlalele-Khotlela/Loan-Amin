import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

type Member = {
  member_Id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  gender?: "male" | "female" | "other";
  dashboard?: {
    loans: { _sum: { balance: number }; _count: number };
    savings: { _sum: { amount: number }; _count: number };
    groupTransactions: { type: string; amount: number }[];
    shareCapital: {_sum:{balance: number}};
  };
};

export default function MembersList({ members }: { members: Member[] }) {
  return (
    <Card className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl font-extrabold text-blue-700 tracking-wide">
          Registered Members
        </CardTitle>
        <CardDescription className="text-gray-500">
          Overview of all members in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                <th className="px-4 py-2 text-left">Member ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Total Loans</th>
                <th className="px-4 py-2 text-left">Total Savings</th>
                <th className="px-4 py-2 text-left">Share Capital</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.member_Id}
                  className="border-b hover:bg-blue-50 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-gray-800">
                    <Link href={`/admin/members/${m.member_Id}`}>
                      {m.member_Id}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{m.email}</td>
                  <td className="px-4 py-2 text-gray-700">{m.phone}</td>
                  <td className="px-4 py-2">
                    {m.dashboard?.loans._sum.balance ?? 0}
                  </td>
                  <td className="px-4 py-2">
                    {m.dashboard?.savings._sum.amount ?? 0}
                  </td>
                  <td className="px-4 py-2">{m.dashboard?.shareCapital._sum.balance ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
