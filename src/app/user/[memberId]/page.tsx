"use client";
import UserProfile from "./client";
import {UserInfo} from"@/types/userType";
import { useEffect, useState } from "react";



export default function UserProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      // decode token to get memberId
      const payload = JSON.parse(atob(token.split(".")[1]));
      const memberId = payload.id;
      // console.log("Frontend calling:", `/api/user/${memberId}`);

      
       fetch(`/api/user/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async(res)=>{
        if (!res.ok){
          console.log("Unauthorized or forbidden:", await res.json());

          return null;
        }
        return res.json()
      })
      .then((data)=> {
        if(data)
           setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          status: data.status,
          email: data.email,
          member_Id: data.member_Id,
          Phone: data.phone,
        });
        console.log("API returned:", data);

      })

      
        
       
      
    }
    fetchUser();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div>
       <UserProfile {...user}/>
    </div>
   
  );
}
