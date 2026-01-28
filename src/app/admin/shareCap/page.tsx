"use client";

import { useEffect, useState } from "react";

interface ShareCapital {
  id: number;
  member_Id: number;
  amount: number;
  Current_interest: number;
  Accumu_interest: number;
  balance: number;
}

export default function ShareCapitalPage() {
  const [data, setData] = useState<ShareCapital[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editItem, setEditItem] = useState<ShareCapital | null>(null);
  const [withdrawItem, setWithdrawItem] = useState<ShareCapital | null>(null);
  const [inputValue, setInputValue] = useState("");

  async function fetchData(query?: string) {
    const res = await fetch(`/api/share-cap${query ? `?memberId=${query}` : ""}`);
    if (res.ok) {
      setData(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleEditSubmit() {
  if (!editItem) return;
  await fetch(`/api/share-cap/${editItem.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accumulatedInterest: Number(inputValue) }),
  });
  setEditItem(null);
  setInputValue("");
  fetchData(search);
}


async function handleWithdrawSubmit() {
  if (!withdrawItem) return;
  await fetch(`/api/share-cap/${withdrawItem.id}`, {
    method: "POST",
  });
  setWithdrawItem(null);
  setInputValue("");
  fetchData(search);
}


  if (loading) return <p className="p-4">Loading share capital data...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Share Capital Overview</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Member ID"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={() => fetchData(search)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Member ID</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Current Interest</th>
            <th className="border p-2">Accumulated Interest</th>
            <th className="border p-2">Totals</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">{row.member_Id}</td>
              <td className="border p-2">{row.amount}</td>
              <td className="border p-2">{row.Current_interest}</td>
              <td className="border p-2">{row.Accumu_interest}</td>
              <td className="border p-2">{row.balance}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditItem(row)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => setWithdrawItem(row)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Withdraw
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Edit Amount</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="New Amount"
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditItem(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {withdrawItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Withdraw Amount</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Withdraw Amount"
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setWithdrawItem(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={handleWithdrawSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
