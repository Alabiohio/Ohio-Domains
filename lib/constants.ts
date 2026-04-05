// Static Pricing Matrix for common TLDs (First-Year Promo Estimates)
// Used as a fallback if the Background Scraper DB fails
export const FALLBACK_MATRIX: Record<string, any> = {
  'com': { godaddy: 0.01, porkbun: 10.37, namecom: 11.88, namecheap: 5.98, hostinger: 9.99, cloudflare: 9.77, dynadot: 7.99, spaceship: 3.48 },
  'net': { godaddy: 14.99, porkbun: 11.48, namecom: 13.99, namecheap: 11.18, hostinger: 12.99, cloudflare: 11.05, dynadot: 8.99, spaceship: 4.88 },
  'org': { godaddy: 9.99, porkbun: 10.83, namecom: 12.99, namecheap: 8.98, hostinger: 12.99, cloudflare: 11.53, dynadot: 7.99, spaceship: 5.88 },
  'info': { godaddy: 3.99, porkbun: 4.88, namecom: 15.50, namecheap: 3.98, hostinger: 15.99, cloudflare: 19.53, dynadot: 3.99, spaceship: 2.88 },
  'io': { godaddy: 39.99, porkbun: 34.50, namecom: 39.99, namecheap: 31.98, hostinger: 39.99, cloudflare: 45.00, dynadot: 30.99, spaceship: 28.88 },
  'guru': { godaddy: 31.99, porkbun: 28.00, namecom: 29.99, namecheap: 32.98, hostinger: 29.99, cloudflare: 29.00, dynadot: 28.99, spaceship: 27.88 },
  'default': { godaddy: 15.00, porkbun: 12.00, namecom: 14.00, namecheap: 12.50, hostinger: 12.50, cloudflare: 12.00, dynadot: 10.99, spaceship: 9.00 }
};
