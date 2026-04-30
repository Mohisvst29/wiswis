export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hero from "@/models/Hero";

export async function GET() {
  try {
    await connectDB();
    const heroes = await Hero.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(heroes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const hero = await Hero.create(body);
    return NextResponse.json(hero, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
