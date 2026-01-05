import Link from "next/link";

export default async function MemberProfile({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

  const res = await fetch(new URL(`/api/Member/${memberId}`, baseUrl), {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API ERROR:", errorText);
    return <div className="p-6">Failed to load member</div>;
  }

  const member = await res.json();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {member.firstName} {member.lastName}
        </h1>

        <div className="flex gap-3">
          <Link
            href={`/admin/members/${memberId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Edit Member
          </Link>

          <Link
            href={`/admin/members/${memberId}/groups`}
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
          >
            Manage Groups
          </Link>
        </div>
      </div>

      

      {/* Member Info */}
      <div className="bg-white shadow rounded-lg p-6 border space-y-2">
        <h2 className="text-lg font-semibold">Member Information</h2>
        <p><strong>Phone:</strong> {member.phone}</p>
        <p><strong>Joined:</strong> {new Date(member.created_at).toDateString()}</p>
      </div>

      {/* Loans */}
      <div className="bg-white shadow rounded-lg p-6 border space-y-2">
        <h2 className="text-lg font-semibold">Loans</h2>
        {member.loan.length === 0 ? (
          <p className="text-gray-600">No loans recorded.</p>
        ) : (
          <ul className="space-y-2">
            {member.loan.map((l: any) => (
              <div key={l.loan_id} className="border rounded p-4">
                <p><strong>Loan Amount:</strong> R {l.amount}</p>
          <p><strong>Interest :</strong> {l.intrests}</p>
          <p><strong>Total Payable:</strong> R {l.totals}</p>
          <p><strong>Instalment:</strong> R {l.instalments}</p>
          <p><strong>Balance:</strong> R {l.balance}</p>
          <p><strong>Loan Type</strong> {l.loan_type}</p>
          <p><strong>Issued:</strong> {new Date(l.created_at).toLocaleDateString()}</p>
                
              </div>
            ))}
          </ul>
        )}
      </div>

      {/* Individual Savings */}
        <div className="bg-white shadow rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">Individual Savings</h2>

            {member.savings.length === 0 ? (
                <p className="text-gray-600">No  Active Savings</p>
            ) : (
                <ul className="space-y-3">
                    {member.savings.map((s: any) =>(
                        <li key={s.savings_id}>
                            <p><strong>Savings Type</strong> {s.savings_type}</p>
                            <p><strong>Amount</strong> {s.amount}</p>
                            <p><strong>Interests</strong> {s.interest}</p>
                            <p><strong>Started At</strong> {new Date(s.started_at).toLocaleDateString()}</p>
                            <p><strong>Accoumulated totals</strong> {s.total}</p>

                        </li>
                    ))}
                </ul>
            )

            
        }
            </div>

      {/* Group Groups */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Groups Savings</h2>

        {member.groupSavings.length === 0 ? (
          <p className="text-gray-600">This member is not part of any groups.</p>
        ) : (
          <ul className="space-y-3">
            {member.groupSavings.map((g: any) => (
              <li key={g.group_id}>
                <Link
                  href={`/admin/dashboard/groups/${g.group_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {g.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Group Deposits */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Group Deposits</h2>

        {member.GroupDeposits.length === 0 ? (
          <p className="text-gray-600">No deposits recorded.</p>
        ) : (
          <ul className="space-y-2">
            {member.GroupDeposits.map((d: any) => (
              <li key={d.id} className="border-b pb-2">
                R {d.amount} — {new Date(d.deposited_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* loan requests */}

        <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Loan Requests</h2>
        {member.loanrequest.length === 0 ? (
          <p className="text-gray-600">No loan requests recorded.</p>
        ) : (
            <ul className="space-y-2">
            {member.loanrequest.map((lr: any) => (
                <li key={lr.id} className="border-b pb-2">
                R {lr.amount} — {lr.status} — {new Date(lr.requested_at).toLocaleDateString()}
                </li>
            ))}
            </ul>
        )}
      </div>

      {/* Group Withdrawals */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h2 className="text-lg font-semibold mb-4">Withdrawals</h2>

        {member.GroupWithdrawal.length === 0 ? (
          <p className="text-gray-600">No withdrawals recorded.</p>
        ) : (
          <ul className="space-y-2">
            {member.GroupWithdrawal.map((w: any) => (
              <li key={w.id} className="border-b pb-2">
                R {w.amount} — {new Date(w.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
