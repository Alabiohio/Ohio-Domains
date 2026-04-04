# **Ohio Domains – Implementation Plan**

**Purpose:** Find the cheapest domain across providers, starting with GoDaddy and Name.com.

---

## **1️⃣ Requirements & Scope**

**Core Functionality:**

* Search a domain name once.
* Check availability on GoDaddy and Name.com.
* Fetch or display prices + renewal costs.
* Compare prices and highlight the cheapest option.
* Provide direct “Buy” links for each provider.

**Optional / Future Features:**

* Support more registrars (Namecheap, Porkbun, Google Domains, etc.).
* Alternative TLD suggestions.
* User accounts to save searches.
* Price alerts and notifications.

---

## **2️⃣ Tech Stack**

| Layer    | Technology / Tool                                           |
| -------- | ----------------------------------------------------------- |
| Frontend | React / Next.js                                             |
| Styling  | Tailwind CSS                                                |
| Backend  | Node.js (Next.js API routes)                                |
| APIs     | GoDaddy API, Name.com API                                   |
| Hosting  | Vercel (frontend + serverless API)                          |
| Database | Optional: Supabase     (for caching / saved searches)             |

---

## **3️⃣ Data Sources**

| Registrar | API Availability                   | Notes                       |
| --------- | ---------------------------------- | --------------------------- |
| GoDaddy   | ✅ Yes                              | Requires API key & secret   |
| Name.com  | ✅ Yes                              | Requires API key & username |
| Future    | Namecheap, Porkbun, Google Domains | Can be added later          |

---

## **4️⃣ User Flow**

1. User opens Ohio Domains page.
2. Enters domain name (e.g., `ohiocodespace.com`) in search bar.
3. Clicks **Search**.
4. Backend checks availability + prices via APIs:

   * GoDaddy
   * Name.com
5. Backend returns results as JSON.
6. Frontend displays table:

   * Registrar | Price | Renewal | Buy Link
   * Highlights **cheapest registrar**.
7. User clicks **Buy** to purchase the domain from chosen provider.
8. Optional: Show alternative TLDs if domain unavailable.

---

## **5️⃣ MVP Features**

* Search bar for domain name.
* Table showing **GoDaddy + Name.com prices + renewal**.
* Highlight the cheapest option.
* Buy links for each registrar.
* Mobile-friendly UI.

---

## **6️⃣ Backend Implementation Steps**

1. Create **API route** `/api/check` in Next.js.
2. Accept query parameter `domain`.
3. Call **GoDaddy API** for availability + price.
4. Call **Name.com API** for availability + price.
5. Compare prices, determine **cheapest registrar**.
6. Return JSON object:

```json
{
  "domain": "example.com",
  "available": true,
  "prices": [
    { "registrar": "GoDaddy", "price": 12.99, "renewal": 14.99, "buyLink": "..." },
    { "registrar": "Name.com", "price": 11.88, "renewal": 13.88, "buyLink": "..." }
  ],
  "cheapest": "Name.com"
}
```

7. Optional: cache results to reduce repeated API calls.

---

## **7️⃣ Frontend Implementation Steps**

1. Build **SearchBar** component:

   * Input field + Search button.
2. Build **ResultsTable** component:

   * Map over `results.prices`.
   * Show registrar, price, renewal, buy link.
   * Highlight cheapest price row.
3. Handle **loading states** and errors (domain unavailable, API fail).
4. Optional: show **alternative TLD suggestions** if unavailable.
5. Style with **Tailwind CSS** for responsive layout.

---

## **8️⃣ Deployment**

* Host **Next.js frontend + API routes** on **Vercel**.
* Connect environment variables for API keys (GoDaddy + Name.com).
* Optional: Use Redis or in-memory cache to reduce API calls.

---

## **9️⃣ Timeline (Recommended)**

| Phase                         | Tasks                                                 | Estimated Time |
| ----------------------------- | ----------------------------------------------------- | -------------- |
| Phase 1 – MVP                 | Setup Next.js project, implement search + mock prices | 1–2 days       |
| Phase 2 – Backend Integration | Integrate GoDaddy + Name.com APIs                     | 1–2 days       |
| Phase 3 – Frontend            | Display results, highlight cheapest, add buy links    | 1 day          |
| Phase 4 – Deployment          | Deploy to Vercel, test API calls                      | 0.5–1 day      |
| Phase 5 – Enhancements        | Add TLD suggestions, caching, extra registrars        | 2–3 days       |

---

## **10️⃣ Optional Future Enhancements**

* Add **more registrars** (Namecheap, Porkbun, Hostinger, Google Domains).
* Alternative **TLD suggestions** for unavailable domains.
* User **account system** (saved searches, favorites).
* Price **alerts / notifications**.
* Analytics for trending domains.


