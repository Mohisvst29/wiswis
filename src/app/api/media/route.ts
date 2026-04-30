export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Media } from '@/models';

export async function GET() {
  await connectDB();
  const media = await Media.find().sort({ createdAt: -1 });
  return NextResponse.json(media);
}
