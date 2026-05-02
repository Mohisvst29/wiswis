export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Settings } from '@/models';

// One-time migration to update the company name in database
export async function POST() {
  try {
    await connectDB();
    
    // Update siteNameAr
    await Settings.findOneAndUpdate(
      { key: 'siteNameAr' },
      { value: 'شركة وسوس للتجارة' },
      { upsert: true }
    );
    
    // Update siteNameEn
    await Settings.findOneAndUpdate(
      { key: 'siteNameEn' },
      { value: 'Wiswis Trading Company' },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true, message: 'Company name updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
