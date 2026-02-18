
"user client";

import { UserInfo } from "@/types/userType";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


export default function UserProfile() {
  const [user, setUser] = useState<UserInfo | null>(null);

  // Safe JWT decoder
  function decodeJWT(token: string) {
    try {
      if (!token || !token.includes(".")) return null;

      const parts = token.split(".");
      if (parts.length < 2) return null;

      const base64 = parts[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const padded = base64.padEnd(
        base64.length + (4 - (base64.length % 4)) % 4,
        "="
      );

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const token = Cookies.get("token");
      if (!token) {
        console.warn("No token found");
        return;
      }

      const payload = decodeJWT(token);
      if (!payload) {
        console.error("Invalid or malformed token");
        return;
      }

      const memberId = payload.id;

      try {
        const res = await fetch(`/api/user/${memberId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Unauthorized or forbidden:", await res.json());
          return;
        }

        const data = await res.json();

        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          status: data.status,
          email: data.email,
          member_Id: data.member_Id,
          Phone: data.phone,
        });

       
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, []);

  if (!user) return <p>Loading profile...</p>;
return (
  <div>
    <h1>{user.firstName} {user.lastName}</h1>
    <p>Status: {user.status}</p>
    <p>Email: {user.email}</p>
    <p>Phone: {user.Phone}</p>
    <p>Member ID: {user.member_Id}</p>
  </div>
);

}
