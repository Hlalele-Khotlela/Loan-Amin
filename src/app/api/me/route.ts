import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  // ✅ cookies() is synchronous in route handlers
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
