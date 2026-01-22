"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [memberId, setMemberId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, memberId }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Redirect to profile
    router.push(`/user/${data.member.member_Id}`);

  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="space-y-4 border p-6 rounded">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
