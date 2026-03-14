const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Load products
let products = [];
let reviews = {};
try {
  const data = require('./data/products');
  products = Array.isArray(data?.products) ? data.products : [];
  reviews = data?.reviews || {};
} catch (e) {
  console.warn('Products file load failed:', e.message);
}
if (products.length === 0) {
  products = [
    { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 89.99, rating: 4.5, reviewCount: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', description: 'Premium sound quality, 30hr battery, noise cancellation' },
    { id: 2, name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 129.99, rating: 4.7, reviewCount: 412, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop', description: 'RGB backlight, Cherry MX switches' },
    { id: 3, name: 'USB-C Fast Charging Cable Pack', category: 'Electronics', price: 19.99, rating: 4.3, reviewCount: 1890, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', description: '2-pack, 100W power delivery' },
  ];
}

const app = express();
app.use(cors());
app.use(express.json());

// Health check - verifies API is reachable
app.get('/api/health', (req, res) => {
  res.json({ ok: true, products: products.length });
});

// Parse user message for intent: keywords, price range
function parseQuery(text) {
  const lower = text.toLowerCase();
  const keywords = [];
  let maxPrice = Infinity;
  let minPrice = 0;

  // Price extraction
  const priceMatch = lower.match(/(?:under|below|less than|max|up to)\s*\$?(\d+(?:\.\d+)?)/i)
    || lower.match(/\$?(\d+(?:\.\d+)?)\s*(?:and under|or less)/i)
    || lower.match(/under\s*\$?(\d+)/i)
    || lower.match(/around\s*\$?(\d+)/i)
    || lower.match(/\$(\d+)/g);
  
  if (priceMatch) {
    const nums = Array.isArray(priceMatch) ? priceMatch.map(m => parseFloat(String(m).replace(/\$/g, ''))) : [parseFloat(priceMatch[1])];
    if (nums.length >= 2) {
      minPrice = Math.min(...nums);
      maxPrice = Math.max(...nums);
    } else if (lower.includes('under') || lower.includes('below') || lower.includes('less than') || lower.includes('max')) {
      maxPrice = nums[0] || Infinity;
    } else if (lower.includes('around')) {
      minPrice = (nums[0] || 0) * 0.6;
      maxPrice = (nums[0] || 0) * 1.4;
    } else {
      maxPrice = nums[0] || Infinity;
    }
  }

  // Category/keyword extraction
  const categories = ['electronics', 'clothing', 'footwear', 'bags', 'home', 'sports', 'accessories'];
  const words = lower.split(/\s+/);
  for (const w of words) {
    if (categories.includes(w)) keywords.push(w);
    else if (w.length > 2 && !/^\d+$/.test(w)) keywords.push(w);
  }

  // Common product terms
  const terms = ['headphone', 'keyboard', 'mouse', 'cable', 'charger', 'power', 'bank', 'stand', 'watch', 'webcam', 'lamp', 'shirt', 'shoe', 'backpack', 'bottle', 'yoga', 'speaker', 'earbud', 'coffee', 'wallet', 'screen', 'desk'];
  for (const t of terms) {
    if (lower.includes(t)) keywords.push(t);
  }

  return { keywords: [...new Set(keywords)], minPrice, maxPrice };
}

// Score product for best pick: rating + reviews + price fit
function scoreProduct(p, query, productReviews) {
  let score = p.rating * 20; // base from rating (max 100)
  score += Math.min(p.reviewCount / 50, 20); // more reviews = more trust
  if (p.price >= query.minPrice && p.price <= query.maxPrice) {
    const range = query.maxPrice - query.minPrice;
    const mid = query.minPrice + range / 2;
    const dist = Math.abs(p.price - mid);
    score += Math.max(0, 15 - (dist / mid) * 15); // prefer mid-range
  }
  const revs = productReviews || [];
  const avgRev = revs.length ? revs.reduce((s, r) => s + r.rating, 0) / revs.length : 0;
  score += avgRev * 2;
  return score;
}

// API: List products (minimal handler - no logic that can throw)
app.get('/api/products', (req, res) => {
  try {
    const list = Array.isArray(products) && products.length > 0 ? products : [
      { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 89.99, rating: 4.5, reviewCount: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', description: 'Premium sound quality' },
    ];
    let result = JSON.parse(JSON.stringify(list));
    const { category, maxPrice, q } = req.query || {};
    if (category && typeof category === 'string') {
      const c = category.toLowerCase();
      result = result.filter(p => (p.category || '').toLowerCase() === c);
    }
    const max = parseFloat(maxPrice);
    if (!isNaN(max) && max > 0) {
      result = result.filter(p => (Number(p.price) || 0) <= max);
    }
    if (q && typeof q === 'string') {
      const ql = q.toLowerCase();
      result = result.filter(p =>
        (String(p.name || '')).toLowerCase().includes(ql) ||
        (String(p.category || '')).toLowerCase().includes(ql) ||
        (String(p.description || '')).toLowerCase().includes(ql)
      );
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('/api/products error:', err);
    return res.json([{ id: 1, name: 'Fallback Product', category: 'Electronics', price: 99, rating: 4.5, reviewCount: 0, image: 'https://via.placeholder.com/300', description: 'Demo' }]);
  }
});

// API: Chat / Suggest
app.post('/api/chat', (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message required' });
    }

    const list = Array.isArray(products) ? products : [];
    const intent = parseQuery(message);
    let matched = list;

  if (intent.keywords.length > 0) {
    matched = list.filter(p => {
      const searchStr = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
      return intent.keywords.some(k => searchStr.includes(k) || p.category.toLowerCase().includes(k));
    });
  }

  matched = matched.filter(p => p.price >= intent.minPrice && p.price <= intent.maxPrice);
  if (matched.length === 0) matched = list.filter(p => p.price <= intent.maxPrice);
  if (matched.length === 0) matched = list;

  const scored = matched.map(p => ({
    ...p,
    score: scoreProduct(p, intent, reviews[p.id] || []),
  })).sort((a, b) => b.score - a.score);

  const suggestions = scored.slice(0, 6);
  const bestPick = suggestions[0] || null;

  res.json({
    products: suggestions,
    bestPick,
    intent: {
      keywords: intent.keywords,
      priceRange: { min: intent.minPrice, max: intent.maxPrice === Infinity ? null : intent.maxPrice },
    },
  });
  } catch (err) {
    console.error('API /api/chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend (must be AFTER API routes)
const clientDist = path.join(__dirname, 'client', 'dist');
const hasBuild = fs.existsSync(clientDist) && fs.existsSync(path.join(clientDist, 'index.html'));

if (hasBuild) {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.send(`
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>ShopAI</title></head>
      <body style="font-family:sans-serif;max-width:600px;margin:50px auto;padding:20px;">
        <h1>Build required</h1>
        <p>Run these commands in order:</p>
        <pre style="background:#eee;padding:16px;border-radius:8px;">cd client
npm install
npm run build
cd ..
node server-ecommerce.js</pre>
        <p>Then open <a href="http://localhost:3000">http://localhost:${PORT}</a></p>
      </body></html>
    `);
  });
}

const PORT = process.env.PORT || 3000;
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err?.message || 'Internal server error' });
});
app.listen(PORT, () => {
  console.log(`\n🛒 ShopAI API running at http://localhost:${PORT}`);
  console.log(`   Products: ${products.length} | Try: http://localhost:${PORT}/api/health\n`);
  if (!hasBuild) console.log('⚠️  No client build. Run: cd client && npm run build\n');
});
