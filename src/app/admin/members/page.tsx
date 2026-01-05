import Link from "next/link";

export default async function MembersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9002";

  const res = await fetch(new URL("/api/Member", baseUrl), {
    cache: "no-store",
  });

  const members = await res.json();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Members</h1>

        <Link
          href="/admin/register"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Member
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m: any) => (
              <tr key={m.member_Id} className="border-t">
                <td className="p-3">{m.firstName} {m.lastName}</td>
                <td className="p-3">{m.phone}</td>
                <td className="p-3 space-x-3">
                  <Link
                    href={`/admin/members/${m.member_Id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/members/${m.member_Id}/edit`}
                    className="text-green-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
