import { NextResponse } from "next/server";

import  {prisma} from "../../../lib/prisma/prisma";


// const prisma = new PrismaClient();


export async function POST(req: Request) {
  // const { firstName, LastName, Email, Gender, Phone } = await req.json();
  console.log("Saving member:");

  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const body = await req.json();
    console.log("Received body:", body);
    const { firstName, lastName, email, gender, phone } = body;
    console.log("Parsed member data:", { firstName, lastName, email, gender, phone, Member_Id: Date.now().toString() });

    if (!firstName || !lastName || !email || !gender || !phone) {
      console.error("Missing required fields");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
// firstName: firstName,
      // lastName: lastName,
      // email: email,
      // gender: gender,
      // phone: phone,
   const member = await prisma.member.create({
    data:body
   });

 
    console.log("Member saved:", member);
    return NextResponse.json({ member: "Member saved" }, { status: 201 });
  } catch (error) {
    console.error("db error:", error);
    return NextResponse.json({ message: "Error saving member", error }, { status: 500 });
  }
 
}
//   });

//   return NextResponse.json({ message: "Loan saved", loan });
// }

// export async function GET() {
//   const members = await prisma.members.findMany();
//   return NextResponse.json(members);
// }
