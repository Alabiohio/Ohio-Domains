import { NextResponse } from 'next/server';
import { getHostingerDynamicPricing } from '../../../lib/hostinger';

// Static Pricing Matrix for common TLDs (First-Year Promo Estimates)
const PRICING_MATRIX: Record<string, any> = {
  'com': { godaddy: 0.01, porkbun: 10.37, namecom: 11.88, namecheap: 5.98, hostinger: 9.99, cloudflare: 9.77, dynadot: 7.99, spaceship: 3.48 },
  'net': { godaddy: 14.99, porkbun: 11.48, namecom: 13.99, namecheap: 11.18, hostinger: 12.99, cloudflare: 11.05, dynadot: 8.99, spaceship: 4.88 },
  'org': { godaddy: 9.99, porkbun: 10.83, namecom: 12.99, namecheap: 8.98, hostinger: 12.99, cloudflare: 11.53, dynadot: 7.99, spaceship: 5.88 },
  'info': { godaddy: 3.99, porkbun: 4.88, namecom: 15.50, namecheap: 3.98, hostinger: 15.99, cloudflare: 19.53, dynadot: 3.99, spaceship: 2.88 },
  'io': { godaddy: 39.99, porkbun: 34.50, namecom: 39.99, namecheap: 31.98, hostinger: 39.99, cloudflare: 45.00, dynadot: 30.99, spaceship: 28.88 },
  'guru': { godaddy: 31.99, porkbun: 28.00, namecom: 29.99, namecheap: 32.98, hostinger: 29.99, cloudflare: 29.00, dynadot: 28.99, spaceship: 27.88 },
  'default': { godaddy: 15.00, porkbun: 12.00, namecom: 14.00, namecheap: 12.50, hostinger: 12.50, cloudflare: 12.00, dynadot: 10.99, spaceship: 9.00 }
};

/**
 * Checks domain availability via public RDAP (Registration Data Access Protocol)
 * RDAP is the official successor to WHOIS and returns JSON.
 */
async function checkAvailabilityRDAP(domain: string): Promise<boolean | null> {
  try {
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (response.status === 404) return true;
    if (response.status === 200) return false;
    
    return null;
  } catch (error) {
    console.error('RDAP Check Failed:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
  }

  const parts = domain.split('.');
  const tld = parts.pop()?.toLowerCase() || 'default';
  const sld = parts.join('.'); // The domain part without TLD
  const pricing = PRICING_MATRIX[tld] || PRICING_MATRIX['default'];

  const namecomApiKey = process.env.NAMECOM_API_KEY;
  const namecomUsername = process.env.NAMECOM_USERNAME;
  const hostingerApiKey = process.env.HOSTINGER_API_KEY;
  
  const hasNamecomKeys = Boolean(namecomApiKey && namecomUsername);
  const hasHostingerKeys = Boolean(hostingerApiKey);
  
  let results: any[] = [];
  let isAvailable = false;

  // 1. Authoritative Availability Check (RDAP)
  const rdapStatus = await checkAvailabilityRDAP(domain);
  
  if (rdapStatus !== null) {
    isAvailable = rdapStatus;
  }

  // 2. Name.com Live Fetch
  let namecomData = null;
  if (hasNamecomKeys) {
    try {
      const credentials = Buffer.from(`${namecomUsername}:${namecomApiKey}`).toString('base64');
      const namecomApiHost = namecomUsername!.endsWith('-test') ? 'api.dev.name.com' : 'api.name.com';
      
      const response = await fetch(`https://${namecomApiHost}/v4/domains:checkAvailability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ domainNames: [domain] })
      });
      
      if (response.ok) {
        const data = await response.json();
        const result = data.results && data.results[0];
        
        if (result && result.purchasable) {
          if (rdapStatus === null) isAvailable = true;
          
          namecomData = {
            registrar: 'Name.com',
            price: result.purchasePrice || pricing.namecom,
            renewal: result.renewalPrice || pricing.namecom * 1.2,
            type: 'Live',
            buyLink: `https://www.name.com/domain/search/${domain}`
          };
        }
      }
    } catch (err) {
      console.error('Name.com API Error:', err);
    }
  }

  if (!namecomData) {
    namecomData = {
      registrar: 'Name.com',
      price: pricing.namecom,
      renewal: pricing.namecom * 1.2,
      type: 'Estimated',
      buyLink: `https://www.name.com/domain/search/${domain}`
    };
  }

  // 3. Hostinger Live Fetch
  let hostingerData = null;
  const dynamicHostingerPricing = await getHostingerDynamicPricing(tld);
  
  if (hasHostingerKeys) {
    try {
      const response = await fetch('https://developers.hostinger.com/api/domains/v1/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${hostingerApiKey}`
        },
        body: JSON.stringify({
          domain: sld,
          tlds: [tld],
          with_alternatives: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        // API returns: [{ "domain": "example.com", "is_available": true, ... }]
        const hit = Array.isArray(data) ? data.find(d => d.domain === domain) : data;
        
        if (hit && hit.is_available) {
          if (rdapStatus === null) isAvailable = true;
          
          hostingerData = {
            registrar: 'Hostinger',
            price: dynamicHostingerPricing.price, // Live from catalog + exchange rate conversion
            renewal: dynamicHostingerPricing.renewal,
            type: 'Live', // Marked as live because both availability and price are dynamic
            buyLink: `https://www.hostinger.com/domain-checker?domain=${domain}`
          };
        }
      }
    } catch (err) {
      console.error('Hostinger API Error:', err);
    }
  }

  if (!hostingerData) {
    hostingerData = {
      registrar: 'Hostinger',
      price: dynamicHostingerPricing.price,
      renewal: dynamicHostingerPricing.renewal,
      type: 'Estimated',
      buyLink: `https://www.hostinger.com/domain-checker?domain=${domain}`
    };
  }

  // 4. GoDaddy Estimated Pricing
  const godaddyData = {
    registrar: 'GoDaddy',
    price: pricing.godaddy,
    renewal: pricing.godaddy * 1.35, 
    type: 'Estimated',
    buyLink: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${domain}`
  };

  // 5. Porkbun Estimated Pricing
  const porkbunData = {
    registrar: 'Porkbun',
    price: pricing.porkbun,
    renewal: pricing.porkbun,
    type: 'Estimated',
    buyLink: `https://porkbun.com/checkout/search?q=${domain}`
  };

  // 6. Namecheap Estimated Pricing
  const namecheapData = {
    registrar: 'Namecheap',
    price: pricing.namecheap,
    renewal: pricing.namecheap * 1.2,
    type: 'Estimated',
    buyLink: `https://www.namecheap.com/domains/registration/results/?domain=${domain}`
  };

  // 7. Cloudflare Estimated Pricing (Wholesale)
  const cloudflareData = {
    registrar: 'Cloudflare',
    price: pricing.cloudflare,
    renewal: pricing.cloudflare,
    type: 'Estimated',
    buyLink: `https://dash.cloudflare.com/?to=/:account/domains/register`
  };

  // 8. Dynadot Estimated Pricing
  const dynadotData = {
    registrar: 'Dynadot',
    price: pricing.dynadot,
    renewal: pricing.dynadot * 1.15,
    type: 'Estimated',
    buyLink: `https://www.dynadot.com/domain/search?domain=${domain}`
  };

  // 9. Spaceship Estimated Pricing
  const spaceshipData = {
    registrar: 'Spaceship',
    price: pricing.spaceship,
    renewal: pricing.spaceship * 1.1,
    type: 'Estimated',
    buyLink: `https://www.spaceship.com/domain-search/?query=${domain}`
  };

  // Collect all results
  results = [porkbunData, hostingerData, namecomData, namecheapData, godaddyData, cloudflareData, dynadotData, spaceshipData];

  if (rdapStatus === false) {
    return NextResponse.json({
      domain,
      available: false,
      prices: [],
      cheapest: null
    });
  }

  // Determine cheapest from the list
  const cheapest = results.reduce((prev, curr) => (prev.price < curr.price) ? prev : curr).registrar;

  return NextResponse.json({
    domain,
    available: isAvailable,
    prices: results,
    cheapest
  });
}


