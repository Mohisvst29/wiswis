import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Hero from "@/models/Hero";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const hero = await Hero.findByIdAndUpdate(id, body, { new: true });
    if (!hero) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(hero);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Hero.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
