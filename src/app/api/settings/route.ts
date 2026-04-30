import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Settings } from '@/models';

export async function GET() {
  await connectDB();
  const settings = await Settings.find();
  const settingsObj = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  return NextResponse.json(settingsObj);
}

export async function POST(req: Request) {
  await connectDB();
  const data = await req.json();
  
  if (Array.isArray(data)) {
      // bulk update
      for(const item of data) {
          await Settings.findOneAndUpdate({ key: item.key }, { value: item.value }, { upsert: true });
      }
  } else {
      await Settings.findOneAndUpdate({ key: data.key }, { value: data.value }, { upsert: true });
  }
  
  return NextResponse.json({ success: true }, { status: 200 });
}
