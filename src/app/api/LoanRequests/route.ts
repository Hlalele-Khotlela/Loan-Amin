
import  {prisma} from "../../../lib/prisma/prisma";
import { NextResponse } from "next/server";

// pages/api/loanRequests.js


export async function GET(req: Request) {
 
  
  const url = new URL(req.url);
  const loan_type = url.searchParams.get("selectedType");
  const search = url.searchParams.get("search");
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 10);
  // const skip = (page - 1) * limit;
  


    try {
      const where: any = {
        
      };
      if (loan_type && loan_type !== "all") {
        where.loan_type = {
          equals: loan_type,
          
        }
      }
      if (search) {
        where.applicant ={
          contains: search,
          mode: "insensitive",
        }
      }
      // get total count for pagination
      const total = await prisma.loanrequest.count({ where });
      const totalPages = Math.max(1, Math.ceil(total / limit));

      const safePage = Math.min(page, totalPages);
      const skip = (safePage - 1) * limit;
      
      // get paginated results
      
    
    
      const result = await prisma.loanrequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { request_id: "desc" },
        select: {
          request_id: true,
          applicant: true,
          status: true,
          amount: true,
          balance: true,
          loan_type: true,
          type: true,
        }
      });
      // Log the raw rows before sending
    // console.log("DB result:", result.rows);
    
   console.log("Filters:", { type: loan_type, where });
   
   return NextResponse.json({ data: result,
      
        pagination: {
          total,
          page: safePage,
          limit,
          totalPages,
        }
      }
    );

     
    } catch (err) {
      console.error("DB error:", err);
      return new Response(JSON.stringify({ error: "Database error20" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    
    }
  
}

