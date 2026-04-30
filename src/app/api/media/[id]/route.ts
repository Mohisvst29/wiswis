import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Media } from '@/models';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Media.findByIdAndDelete(params.id);
  // Optional: Delete from Cloudinary here using Cloudinary Admin API
  return NextResponse.json({ success: true });
}
