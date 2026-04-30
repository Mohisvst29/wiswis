export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { ContactMessage } from '@/models';

export async function GET() {
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const message = await ContactMessage.create(data);
  return NextResponse.json(message, { status: 201 });
}
