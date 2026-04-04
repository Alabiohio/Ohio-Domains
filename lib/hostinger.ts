// Use standard fallback estimates locally if everything completely fails
const FALLBACK_MATRIX: Record<string, any> = {
  'com': { price: 9.99, renewal: 13.99 },
  'net': { price: 12.99, renewal: 14.99 },
  'org': { price: 12.99, renewal: 15.99 },
  'info': { price: 15.99, renewal: 19.99 },
  'io': { price: 39.99, renewal: 49.99 },
  'default': { price: 12.50, renewal: 15.50 }
};

interface HostingerPricing {
  price: number;
  renewal: number;
}

/**
 * Dynamically fetches the Hostinger Catalog and an Exchange Rate API using Next.js ISR (Data Caching).
 * This ensures data is fetched only once every 24 hours (86400s) globally.
 */
export async function getHostingerDynamicPricing(tld: string): Promise<HostingerPricing> {
  const normalizedTld = tld.toLowerCase().replace('.', '');
  const apiKey = process.env.HOSTINGER_API_KEY;

  if (!apiKey) {
    console.warn("No HOSTINGER_API_KEY found. Falling back to default Hostinger estimates.");
    return FALLBACK_MATRIX[normalizedTld] || FALLBACK_MATRIX['default'];
  }

  try {
    // 1. Fetch Exchange Rates (Cached for 24h)
    const exResponse = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 86400 }
    });
    
    if (!exResponse.ok) throw new Error("Exchange API error");
    const exData = await exResponse.json();
    const rateNGN = exData.rates.NGN; // e.g., 1450.50

    if (!rateNGN) throw new Error("Could not parse NGN rate");

    // 2. Fetch Hostinger Catalog (Cached for 24h)
    const catResponse = await fetch('https://developers.hostinger.com/api/billing/v1/catalog?category=DOMAIN', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      next: { revalidate: 86400 }
    });

    if (!catResponse.ok) throw new Error(`Hostinger Catalog fetch failed: ${catResponse.status}`);
    
    const catalog = await catResponse.json();
    
    // Catalog comes as an array of items
    // name is like ".COM Domain" or "Domain .site" or ".APP Domain" - we find the one where the name or id contains our TLD
    // id is like "hostingerng-domain-com"
    const targetId = `hostingerng-domain-${normalizedTld}`;
    const item = catalog.find((i: any) => i.id === targetId || i.name.toLowerCase().includes(`.${normalizedTld} `));

    if (!item) {
      return FALLBACK_MATRIX[normalizedTld] || FALLBACK_MATRIX['default'];
    }

    // 3. Find the 1-year pricing block
    const oneYearPrice = item.prices.find((p: any) => p.period === 1 && p.period_unit === 'year');
    
    if (!oneYearPrice) {
      return FALLBACK_MATRIX[normalizedTld] || FALLBACK_MATRIX['default'];
    }

    // 4. Convert Prices
    // prices are in cents. e.g., 2790000 = 27900.00 NGN
    const promoNgn = oneYearPrice.first_period_price / 100;
    const renewalNgn = oneYearPrice.price / 100;

    // Convert to USD and round to 2 decimals
    const usdPrice = parseFloat((promoNgn / rateNGN).toFixed(2));
    const usdRenewal = parseFloat((renewalNgn / rateNGN).toFixed(2));

    return {
      price: usdPrice,
      renewal: usdRenewal
    };
    
  } catch (error) {
    console.error("Hostinger Dynamic Pricing Failed:", error);
    // Fallback if network, rate limits, or exchange api fails
    return FALLBACK_MATRIX[normalizedTld] || FALLBACK_MATRIX['default'];
  }
}
