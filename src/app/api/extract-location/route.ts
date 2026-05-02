export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });

    // Try parsing directly first before making a network request
    let lat = null;
    let lng = null;

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

    let coords = extractFromUrl(url);

    // If it's a short link or couldn't find coords, fetch it to resolve redirects
    if (!coords.lat || !coords.lng) {
      const response = await fetch(url, { 
        redirect: 'follow', 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        } 
      });
      
      const finalUrl = response.url;
      coords = extractFromUrl(finalUrl);

      // If still not found, try to search the HTML content for coordinates
      if (!coords.lat || !coords.lng) {
        const html = await response.text();
        const centerMatch = html.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
        if (centerMatch) {
          coords.lat = parseFloat(centerMatch[1]);
          coords.lng = parseFloat(centerMatch[2]);
        }
      }
    }

    if (coords.lat && coords.lng) {
      return NextResponse.json({ lat: coords.lat, lng: coords.lng });
    } else {
      return NextResponse.json({ error: 'Could not extract coordinates from this link' }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Extract location error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
