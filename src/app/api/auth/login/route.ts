export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const adminEmail = process.env.ADMIN_EMAIL || "admin@wiswis.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== adminEmail) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Simple password check (in production, use hashed passwords)
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ email });

    const response = NextResponse.json({ success: true, token });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
