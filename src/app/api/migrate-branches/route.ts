export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { Branch } from '@/models';

const extractFromUrl = (targetUrl: string) => {
  let l1 = null, l2 = null;
  const atMatch = targetUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    l1 = parseFloat(atMatch[1]);
    l2 = parseFloat(atMatch[2]);
  } else {
    const qMatch = targetUrl.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      l1 = parseFloat(qMatch[1]);
      l2 = parseFloat(qMatch[2]);
    }
  }
  return { lat: l1, lng: l2 };
};

export async function GET() {
  try {
    await connectDB();
    const branches = await Branch.find({ mapUrl: { $exists: true, $ne: '' } });
    
    let updatedCount = 0;
    const results = [];

    for (const branch of branches) {
      if (!branch.lat || !branch.lng) {
        let coords = extractFromUrl(branch.mapUrl);
        
        // If not found from direct URL, we need to fetch it
        if (!coords.lat || !coords.lng) {
          try {
            const response = await fetch(branch.mapUrl, { 
              redirect: 'follow', 
              headers: { 'User-Agent': 'Mozilla/5.0' } 
            });
            const finalUrl = response.url;
            coords = extractFromUrl(finalUrl);

            if (!coords.lat || !coords.lng) {
              const html = await response.text();
              const centerMatch = html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
              if (centerMatch) {
                coords.lat = parseFloat(centerMatch[1]);
                coords.lng = parseFloat(centerMatch[2]);
              }
            }
          } catch (e) {
            console.error(`Failed to fetch URL for branch ${branch.nameAr}:`, e);
          }
        }

        if (coords.lat && coords.lng) {
          branch.lat = coords.lat;
          branch.lng = coords.lng;
          await branch.save();
          updatedCount++;
          results.push({ name: branch.nameAr, status: 'Updated', coords });
        } else {
          results.push({ name: branch.nameAr, status: 'Failed to extract', url: branch.mapUrl });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully extracted and updated ${updatedCount} branches.`,
      results 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
