export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Stat from "@/models/Stat";

export async function GET() {
  try {
    await connectDB();
    const stats = await Stat.find().sort({ order: 1 });
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const stat = await Stat.create(body);
    return NextResponse.json(stat, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
