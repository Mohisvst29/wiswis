export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Media } from '@/models';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Media.findByIdAndDelete(id);
  // Optional: Delete from Cloudinary here using Cloudinary Admin API
  return NextResponse.json({ success: true });
}
