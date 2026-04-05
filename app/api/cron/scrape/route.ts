import { NextResponse } from 'next/server';
import { FALLBACK_MATRIX } from '../../../../lib/constants';
import redis from '../../../../lib/redis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  // Extract Authorization header to prevent unauthorized scraping
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
    // Allow localhost manual triggers without a secret for debugging
    process.env.NODE_ENV !== 'development'
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // 1. Start with our base estimates
  let latestMatrix = JSON.parse(JSON.stringify(FALLBACK_MATRIX));
  let log: string[] = [];

  // 2. Safely Fetch Public External Data
  
  // A. PORKBUN (They offer a fully public, unrestricted JSON pricing API)
  try {
    const porkbunRes = await fetch('https://porkbun.com/api/json/v3/pricing/get');
    if (porkbunRes.ok) {
      const data = await porkbunRes.json();
      if (data.status === 'SUCCESS' && data.pricing) {
        Object.keys(latestMatrix).forEach(tld => {
          if (tld !== 'default' && data.pricing[tld]) {
            // Overwrite static matrix with live registration price
            latestMatrix[tld].porkbun = parseFloat(data.pricing[tld].registration);
          }
        });
        log.push("Porkbun LIVE JSON OK");
      }
    }
  } catch (error: any) {
    console.error("Porkbun scrape failed:", error);
    log.push("Porkbun Failed -> Used Base");
  }

  // NOTE: You can easily add more generic `fetch` blocks here for Spaceship, Dynadot, etc.
  // as you discover their public endpoints!

  // 3. Save directly to our REDIS Database
  if (redis) {
    try {
      await redis.set('domain_pricing_matrix', JSON.stringify(latestMatrix));
      log.push('Database Sync OK');
    } catch (e) {
      console.error("Redis saving failed:", e);
      log.push('Database Sync FAILED');
    }
  } else {
    log.push('Database Connection SKIPPED (No URL found)');
  }

  return NextResponse.json({ 
    success: true, 
    log,
    matrix: latestMatrix // Send it back for local debugging
  });
}
