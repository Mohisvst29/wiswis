export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Partner } from '@/models';

export async function GET() {
  await connectDB();
  const partners = await Partner.find().sort({ order: 1 });
  return NextResponse.json(partners);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const partner = await Partner.create(data);
  return NextResponse.json(partner, { status: 201 });
}
