export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import { Partner } from "@/models";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { _id, __v, createdAt, updatedAt, ...updateData } = body;
    const partner = await Partner.findByIdAndUpdate(id, updateData, { new: true });
    if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(partner);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Partner.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
