# ShopAI — E-commerce with AI Chatbox

An e-commerce website with an AI shopping assistant that suggests products based on your query, price range, and **customer reviews & ratings**.

## Features

- **Product catalog** — Browse 20 sample products across Electronics, Clothing, Footwear, Home, Sports, and more
- **AI chatbox** — Type what you want (e.g., "headphones under $100", "best keyboard around $130")
- **Smart recommendations** — The chatbot shows matching items and picks the **best option** using:
  - Customer ratings and review count
  - Price fit (stays within your budget)
  - Historical review sentiment

## Quick Start

### Development (client + API)

1. **Start the API server** (port 3000):
   ```bash
   npm install
   node server-ecommerce.js
   ```

2. **Start the frontend dev server** (port 5173, proxies API):
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser.

### Production (single server)

```bash
npm install
cd client && npm install && npm run build
cd ..
node server-ecommerce.js
```

Open **http://localhost:3000**

## Try the AI Assistant

Examples to type in the chatbox:

- `wireless headphones under $100`
- `best keyboard around $130`
- `power bank for travel`
- `electronics under $50`
- `running shoes`

The assistant returns matching products and highlights the **top pick** based on ratings and reviews.
