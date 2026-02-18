import { NextResponse } from "next/server";

import  {prisma} from "../../../lib/prisma/prisma";
import {z} from "zod";
import { error } from "console";


// const prisma = new PrismaClient();

const memberSchema = z.object({
  member_Id: z.string().regex(/^\d+$/, { message: "Member ID must be a number." }),
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  gender: z.enum(["male", "female", "other"], { message: "Please select a valid gender." }),
  phone: z
    .string()
    .min(7, { message: "Phone number must be at least 7 digits." })
    .regex(/^[0-9+\-()\s]+$/, { message: "Invalid phone number format." }),
});

export async function POST(req: Request) {
  // const { firstName, LastName, Email, Gender, Phone } = await req.json();
  

  try {
    // console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const body = await req.json();
    
    const parsed = memberSchema.safeParse(body);
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors);
      return NextResponse.json({ message: "Validation failed", errors: parsed.error.errors }, { status: 400 });
    }
    const { firstName, lastName, email, gender, phone, member_Id } = body;
    

    // check if email already exists
    const existingMember = await prisma.member.findUnique({
      where: { email: email },
    });

    if(existingMember){
      console.error("Email already exists:", email);
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // ensure all required fields are present

    if (!firstName || !lastName || !email || !gender || !phone || !member_Id) {
      console.error("Missing required fields");

      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
// firstName: firstName,
      // lastName: lastName,
      // email: email,
      // gender: gender,
      // phone: phone,
   const member = await prisma.member.create({
    data: {
      firstName,
      lastName,
      email,
      gender,
      phone,
      member_Id: parseInt(member_Id, 10),
    },
   });

   await prisma.shareOnCapital.create({
    data:{
      member_Id: member.member_Id,
      amount:4000,
      Current_interest:0,
      Accumu_interest: 0,
      balance: 4000,
    }
   });

 
    
    return NextResponse.json({ member: "Member saved" }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("Unique constraint failed:", error.meta);
      return NextResponse.json({ error: "Member ID already exists" }, { status: 400 });
    }
    console.error("db error:", error);
    return NextResponse.json({ error: "Error saving member" }, { status: 500 });
  }
 
}
//   });

//   return NextResponse.json({ message: "Loan saved", loan });
// }

// export async function GET() {
//   const members = await prisma.members.findMany();
//   return NextResponse.json(members);
// }
