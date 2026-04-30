export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { News } from '@/models';

export async function GET() {
  await connectDB();
  const news = await News.find().sort({ date: -1 });
  return NextResponse.json(news);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  const newsItem = await News.create(data);
  return NextResponse.json(newsItem, { status: 201 });
}
