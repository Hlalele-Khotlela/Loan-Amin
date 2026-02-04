
"use client";


import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent } from "@/components/ui/card";
import { LoanApplicationModal } from "@/components/loan-application-form";
import { FloatingAdminButton } from "@/components/floatingButton";
import FloatingActionButton from "@/components/FAB";
import { useAuth } from "@/hooks/useAuth";
import { group } from "console";

const TABS = [
  "Overview",
  "Savings",
  "Loans",
  "Group Savings",
  "Recent Activity",
] as const;

type Tab = (typeof TABS)[number];

export default function UserProfilePage({ member_Id }: { member_Id: number }) {
  const { user } = useAuth();

  const [member, setMember] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [openMenu, setOpenMenu] = useState(false);
  const [openLoanModal, setOpenLoanModal] = useState(false);
    const [open, setOpen] = useState(false);
    
  const tabs = ["Overview", "Savings", "Loans", "Group Savings", "Recent Activity"];

  /* ---------------------------- helpers ---------------------------- */

  const token = useMemo(() => Cookies.get("token"), []);

  const buildActivityFeed = (member: any) => {
    const feed: any[] = [];

    member.savings?.forEach((s: any) =>
      s.transactions.forEach((t: any) =>
        feed.push({
          type: "Savings",
          action: t.type,
          amount: Number(t.amount),
          date: new Date(t.started_at),
        })
      )
    );

    member.loan?.forEach((l: any) =>
      l.transactions.forEach((t: any) =>
        feed.push({
          type: "Loan",
          action: t.type,
          amount: Number(t.amount),
          date: new Date(t.applied_at),
        })
      )
    );

    member.GroupDeposits?.forEach((d: any) =>
      feed.push({
        type: "Group Deposit",
        group: d.group_id,
        groupName: d.group_name,
        amount: Number(d.amount),
        date: new Date(d.created_at),
      })
    );

    member.GroupWithdrawal?.forEach((w: any) =>
      feed.push({
        type: "Group Withdrawal",
        amount: Number(w.amount),
        date: new Date(w.created_at),
        group: w.group_id,
        groupName: w.group_name,
      })
    );

    return feed.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  /* ---------------------------- data fetch ---------------------------- */
console.log("member id is ", member_Id);

  useEffect(() => {
    if ( !member_Id) return;

    const fetchMember = async () => {
      if(!member_Id) return;
      try {
        const res = await fetch(`/api/user/${member_Id}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch member");
        const data = await res.json()
        setMember(data.member);
        
      } catch (err) {
        console.error("Error fetching member: ",err);
        setMember(null);
      }
    };

    fetchMember();
  }, [member_Id]);

  if (!user || !member) return <p>Loading profile...</p>;

  /* ---------------------------- UI ---------------------------- */

  return (
    <div className="p-6">

      

      <Card>
        
        <CardContent>
          {/* Tabs */}

<FloatingAdminButton/>



<FloatingActionButton
  onClick={() => setOpenLoanModal(true)}
  text="Apply for Loan"/>

           <nav className="mb-6 border-b pb-2">

      {/* 🍔 Mobile hamburger */}
      <div className="flex items-center justify-between md:hidden">
        <span className="font-medium">{activeTab}</span>

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl"
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile dropdown */}
      {open && (
        <div className="mt-3 flex flex-col gap-2 md:hidden">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setOpen(false)
              }}
              className={`
                px-4 py-2 rounded text-left
                ${activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-muted-foreground'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* 🖥 Desktop tabs */}
      <div className="hidden md:flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded
              ${activeTab === tab
                ? 'bg-primary text-white'
                : 'text-muted-foreground'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>
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
                  <button
                    className="mt-4 px-4 py-2 bg-primary text-white rounded"
                    onClick={() => {
                      window.open(`/admin/savings/allSavings/${member.member_Id}/${s.savings_id}`, "_blank");
                    }}
                  >
                    View Details
                  </button> 
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
                          {new Date(t.applied_at).toDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className="mt-4 px-4 py-2 bg-primary text-white rounded"
                    onClick={() => {
                      window.open(`/admin/Loans/${member.member_Id}/${l.loan_id}/transactions`, "_blank");
                    }}
                  >
                    View Details
                  </button>
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

                  <a href={`/admin/dashboard/groups/${d.group_id}`} className="text-blue-500 hover:underline">
                    <span>{d.group_id}</span>
                  </a>
                  <span>M {d.amount}</span>
                  <span>{new Date(d.created_at).toDateString()}</span>
                </div>
              ))}
              {member.GroupWithdrawal?.map((w: any) => (
                <div
                  key={w.withdrawal_id}
                  className="flex justify-between border p-2 rounded mb-2"
                >
                  <span>Withdrawal</span>
                  <span>M {w.amount}</span>
                  <span>{new Date(w.created_at).toDateString()}</span>
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
                          {new Date(item.applied_at).toDateString()}
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

/* ---------------------------- small reusable UI ---------------------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
