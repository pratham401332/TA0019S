// Improved AI recommendation logic

const CATEGORY_MAP = {
  shirt: ['shirt', "men's clothing", "women's clothing"],
  tshirt: ['t-shirt', 't shirt', "men's clothing", "women's clothing"],
  't-shirt': ['t-shirt', 'tshirt', 'tee', "men's clothing", "women's clothing"],
  tee: ['t-shirt', 'tshirt', 't shirt'],
  electronics: ['electronics'],
  laptop: ['electronics'],
  phone: ['electronics'],
  headphones: ['electronics'],
  keyboard: ['electronics'],
  watch: ['electronics'],
  jewelry: ['jewelery', 'jewelry'],
  jewelery: ['jewelery'],
  cloth: ["men's clothing", "women's clothing"],
  clothing: ["men's clothing", "women's clothing"],
};

const PRICE_PHRASES = [
  /(?:under|below|less than|max|up to)\s*\$?(\d+(?:\.\d+)?)/i,
  /around\s*\$?(\d+)/i,
  /\$(\d+)/g,
  /(\d+)\s*(?:dollars?|bucks?)/i,
];

export function parseQuery(text) {
  const lower = (text || '').toLowerCase().trim();
  const keywords = new Set();
  let maxPrice = Infinity;
  let minPrice = 0;

  // Price extraction
  for (const re of PRICE_PHRASES) {
    const m = lower.match(re);
    if (m) {
      const nums = Array.isArray(m) && m.length > 1
        ? m.slice(1).map((x) => parseFloat(String(x).replace(/\$/g, '')))
        : [parseFloat(String(m[1] || m[0]).replace(/\$/g, ''))];
      const num = nums[0];
      if (!isNaN(num)) {
        if (lower.includes('around')) {
          minPrice = num * 0.5;
          maxPrice = num * 1.5;
        } else if (lower.includes('under') || lower.includes('below') || lower.includes('max')) {
          maxPrice = num;
        } else {
          maxPrice = num;
        }
        break;
      }
    }
  }

  // Keyword extraction with category mapping
  const words = lower.split(/\s+/).filter((w) => w.length > 1);
  for (const w of words) {
    keywords.add(w);
    const mapped = CATEGORY_MAP[w];
    if (mapped) mapped.forEach((k) => keywords.add(k));
  }

  if (lower.includes('best') || lower.includes('top') || lower.includes('rated')) {
    keywords.add('rating');
  }
  if (lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable')) {
    maxPrice = Math.min(maxPrice, 50);
  }

  return {
    keywords: [...keywords].filter((k) => k !== 'rating'),
    wantsBest: lower.includes('best') || lower.includes('top') || lower.includes('rated'),
    minPrice,
    maxPrice,
  };
}

function matchesProduct(p, intent) {
  if (intent.keywords.length === 0) return true;

  const searchStr = `${p.name} ${p.category} ${p.description || ''}`.toLowerCase();
  const cat = (p.category || '').toLowerCase();

  return intent.keywords.some((k) => {
    if (k === 'rating') return true;
    return searchStr.includes(k) || cat.includes(k);
  });
}

// Generate contextual tips for a product (sales, limited stock, etc.)
function getProductTips(p) {
  const tips = [];
  const cat = (p.category || '').toLowerCase();
  const price = Number(p.price) || 0;
  const reviews = Number(p.reviewCount) || 0;

  if (cat.includes('electronics')) {
    if (price > 80) tips.push('Price may drop 15–25% during Summer or Black Friday sales');
    else tips.push('Often discounted in upcoming Diwali & Summer sales');
  } else if (cat.includes('shirt') || cat.includes('t-shirt') || cat.includes('clothing')) {
    tips.push('Seasonal discounts expected around Diwali and Summer clearance');
  } else if (cat.includes('jewel')) {
    tips.push('Best deals typically during Diwali — price may rise post-festival');
  }

  if (reviews > 800) tips.push('Very popular — limited stock, buy soon to avoid price rise');
  else if (reviews > 400) tips.push('High demand — consider buying before upcoming sales');

  if (price > 100) tips.push('Premium item — wait for sale season for potential 20%+ off');

  return tips.slice(0, 2);
}

export function suggestProducts(products, queryText) {
  if (!products || products.length === 0) return [];

  const intent = parseQuery(queryText);

  let matched = products.filter((p) => matchesProduct(p, intent));

  if (matched.length === 0 && intent.keywords.length > 0) {
    matched = products;
  }

  matched = matched.filter((p) => {
    const price = Number(p.price) || 0;
    return price >= intent.minPrice && price <= intent.maxPrice;
  });

  if (matched.length === 0) {
    matched = products.filter((p) => (Number(p.price) || 0) <= intent.maxPrice);
  }
  if (matched.length === 0) matched = products;

  const rating = (p) => Number(p.rating) || 0;
  const reviews = (p) => Number(p.reviewCount) || 0;

  const scored = matched.map((p) => ({
    ...p,
    score: rating(p) * 30 + Math.min(reviews(p) / 15, 30),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map((p) => ({
    ...p,
    tips: getProductTips(p),
  }));
}
