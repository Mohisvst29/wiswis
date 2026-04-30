export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Service } from '@/models';

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const service = await Service.create(data);
  return NextResponse.json(service, { status: 201 });
}
