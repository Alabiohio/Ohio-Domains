# Ohio Domains

**Find the cheapest domain across providers — GoDaddy & Name.com MVP**

---

## **🌐 Overview**

Ohio Domains helps users:

* Search for a domain name once
* Compare prices across **GoDaddy** and **Name.com**
* See **renewal costs**
* Highlight the **cheapest registrar**
* Click direct links to buy from the provider

Future versions will support more registrars, alternative TLDs, and user accounts.

---

## **📦 Features**

* Domain search bar
* Availability check via API
* Price comparison table: registrar, price, renewal, buy link
* Cheapest price highlight
* Mobile-friendly UI
* Serverless API backend (Next.js API routes)

---

## **🛠️ Tech Stack**

| Layer    | Technology / Tool                                           |
| -------- | ----------------------------------------------------------- |
| Frontend | React / Next.js                                             |
| Styling  | Tailwind CSS / Material UI                                  |
| Backend  | Node.js (Next.js API routes)                                |
| APIs     | GoDaddy API, Name.com API                                   |
| Hosting  | Vercel (frontend + serverless API)                          |
| Database | Optional: MongoDB / Supabase (for caching / saved searches) |

---

## **⚡ Quick Start**

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ohio-domains.git
cd ohio-domains
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Add API keys**
   Create a `.env.local` file in the root:

```
GODADDY_API_KEY=your_godaddy_api_key
GODADDY_API_SECRET=your_godaddy_api_secret
NAMECOM_API_KEY=your_namecom_api_key
NAMECOM_USERNAME=your_namecom_username
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## **🧩 Project Structure**

```
/pages
  index.js       # Main frontend page with search bar + results
  /api
    check.js     # Serverless API route for domain availability + pricing
/components
  SearchBar.js   # Domain input component
  ResultsTable.js# Displays prices and highlights cheapest
/styles
  globals.css    # Tailwind CSS styles
```

---

## **🔧 API Integration**

* **GoDaddy API**: Check domain availability and pricing
  [Developer Docs](https://developer.godaddy.com)
* **Name.com API**: Check domain availability and pricing
  [Developer Docs](https://www.name.com/developers)

**Example API Response:**

```json
{
  "domain": "example.com",
  "available": true,
  "prices": [
    { "registrar": "GoDaddy", "price": 12.99, "renewal": 14.99, "buyLink": "https://..." },
    { "registrar": "Name.com", "price": 11.88, "renewal": 13.88, "buyLink": "https://..." }
  ],
  "cheapest": "Name.com"
}
```

---

## **📈 Next Steps / Enhancements**

* Add more registrars (Namecheap, Porkbun, Google Domains)
* Alternative TLD suggestions if domain unavailable
* User accounts and saved searches
* Price alerts and notifications
* Analytics for trending domains

---

## **⚖️ License**

MIT License © 2026 Ohio Codespace
