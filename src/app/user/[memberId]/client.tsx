"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { usePermission } from "@/hooks/usePermission";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FloatingAdminButton } from "@/components/floatingButton";
import { LoanApplicationModal } from "@/components/loan-application-form";

export default function UserProfilePage({ member_Id }: { member_Id: number }) {
  const [member, setMember] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Savings", "Loans", "Group Savings", "Recent Activity"];
  const { canViewSavings, canViewLoans, canManageStaff } = usePermission();
  const { user } = useAuth();
  const [openLoanModal, setOpenLoanModal] = useState(false);


  function buildActivityFeed(member: any) {
    const feed: any[] = [];

    member.savings?.forEach((s: any) => {
      s.transactions.forEach((t: any) => {
        feed.push({
          type: "Savings",
          account: s.name,
          action: t.type,
          amount: Number(t.amount),
          date: new Date(t.date),
        });
      });
    });

    member.loan?.forEach((l: any) => {
      l.transactions.forEach((t: any) => {
        feed.push({
          type: "Loan",
          loanId: l.id,
          action: t.type,
          amount: Number(t.amount),
          date: new Date(t.date),
        });
      });
    });

    member.GroupDeposits?.forEach((d: any) => {
      feed.push({
        type: "Group Deposit",
        amount: Number(d.amount),
        date: new Date(d.date),
      });
    });

    member.GroupWithdrawal?.forEach((w: any) => {
      feed.push({
        type: "Group Withdrawal",
        amount: Number(w.amount),
        date: new Date(w.date),
      });
    });

    return feed.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  useEffect(() => {
    async function fetchMember() {
      const token = Cookies.get("token");
      console.log("TOKEN IN PROFILE:", token);

      if (!token) {
        console.warn("No token found, not fetching member");
        setMember(null);
        return;
      }

      try {
        const res = await fetch(`/api/user/${member_Id}`, {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`, // keep this only if your API reads it
          },
        });

        console.log("PROFILE API STATUS:", res.status);

        if (!res.ok) {
          console.error("Unauthorized or error:", await res.text());
          setMember(null);
          return;
        }

        const data = await res.json();
        console.log("PROFILE API DATA:", data);

        setMember(data);
      } catch (err) {
        console.error("Failed to fetch member:", err);
        setMember(null);
      }
    }

    if (member_Id) {
      fetchMember();
    } else {
      console.warn("No member_Id prop passed to UserProfilePage");
    }
  }, [member_Id]);

  if (!member) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <Card>
        <CardContent>
          {/* Tabs */}

<FloatingAdminButton/>
          <nav className="mb-6 flex gap-2 border-b pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded ${
                  activeTab === tab ? "bg-primary text-white" : "text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
            

           </nav>
          
 <LoanApplicationModal 
 isOpen={openLoanModal} 
 onClose={() => 
  setOpenLoanModal(false)}
  memberId={member.member_Id}
      />
       
          {/* Overview */}
          {activeTab === "Overview" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="rounded-2xl border p-6">
                <h2 className="text-lg font-semibold mb-4">User Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {member.firstName} {member.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{member.email ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{member.phone ?? "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">{member.Role ?? "Member"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{member.status ?? "Active"}</p>
                  </div>

      
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Savings Balance</p>
                  <p className="mt-1 text-xl font-semibold">
                    M{" "}
                    {member.savings?.reduce(
                      (acc: number, s: any) => acc + Number(s.amount),
                      0
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Active Loans</p>
                  <p className="mt-1 text-xl font-semibold">
                    {member.loan?.length ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Outstanding Loan</p>
                  <p className="mt-1 text-xl font-semibold">
                    M{" "}
                    {member.loan?.reduce(
                      (acc: number, l: any) => acc + Number(l.balance),
                      0
                    )}
                  </p>
                               <button onClick={() => setOpenLoanModal(true)}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply for Loan
        </button>

                </div>
                <div className="rounded-2xl border p-4">
                  <p className="text-sm text-muted-foreground">Group Savings</p>
                  <p className="mt-1 text-xl font-semibold">
                    {member.groupSavings?.length ?? 0} Groups
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Savings */}
          {activeTab === "Savings" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Savings Transactions</h2>
              {member.savings?.map((s: any) => (
                <div key={s.savings_id} className="mb-4 border p-4 rounded">
                  <p className="font-medium">
                    Account: {s.savings_type ?? "Unnamed"}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {s.transactions.map((t: any) => (
                      <li key={t.id} className="flex justify-between">
                        <span>{t.type}</span>
                        <span>M {t.amount}</span>
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Loans */}
          {activeTab === "Loans" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Loan Transactions</h2>
              {member.loan?.map((l: any) => (
                <div key={l.loan_id} className="mb-4 border p-4 rounded">
                  <p className="font-medium">Loan ID {l.loan_id}</p>
                  <p>Type: {l.loan_type}</p>
                  <p>Balance: M {l.balance}</p>
                  <ul className="mt-2 space-y-2">
                    {l.transactions.map((t: any) => (
                      <li key={t.id} className="flex justify-between">
                        <span>{t.type}</span>
                        <span>M {t.amount}</span>
                        <span>
                          {new Date(t.created_at).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Group Savings */}
          {activeTab === "Group Savings" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Group Contributions</h2>
              {member.GroupDeposits?.map((d: any) => (
                <div
                  key={d.group_id}
                  className="flex justify-between border p-2 rounded mb-2"
                >
                  <span>Deposit</span>
                  <span>M {d.amount}</span>
                  <span>{new Date(d.date).toLocaleDateString()}</span>
                </div>
              ))}
              {member.GroupWithdrawal?.map((w: any) => (
                <div
                  key={w.id}
                  className="flex justify-between border p-2 rounded mb-2"
                >
                  <span>Withdrawal</span>
                  <span>M {w.amount}</span>
                  <span>{new Date(w.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent Activity */}
          {activeTab === "Recent Activity" && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Recent Activity</h2>
              <div className="relative border-l border-muted-foreground/30 pl-6">
                {buildActivityFeed(member).map((item, idx) => (
                  <div key={idx} className="mb-6 relative">
                    <span className="absolute -left-3 top-1.5 h-3 w-3 rounded-full bg-primary"></span>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        {item.account && (
                          <p className="text-sm text-muted-foreground">
                            Account: {item.account}
                          </p>
                        )}
                        {item.loanId && (
                          <p className="text-sm text-muted-foreground">
                            Loan #{item.loanId}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {item.action}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">M {item.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}


              </div>

              
            </div>
          )}

   
          
        </CardContent>
      </Card>
    </div>
  );
}
