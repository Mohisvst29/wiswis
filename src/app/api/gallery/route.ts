export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { GalleryImage } from '@/models';

export async function GET() {
  await connectDB();
  const images = await GalleryImage.find().sort({ order: 1, createdAt: -1 });
  return NextResponse.json(images);
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const image = await GalleryImage.create(body);
    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
