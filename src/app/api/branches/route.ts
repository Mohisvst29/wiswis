export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Branch } from '@/models';

export async function GET() {
  await connectDB();
  const branches = await Branch.find();
  return NextResponse.json(branches);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const branch = await Branch.create(data);
  return NextResponse.json(branch, { status: 201 });
}
