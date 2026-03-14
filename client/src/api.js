import { extraProducts } from './extraProducts';

const API_URL = 'https://fakestoreapi.com/products';

function normalizeProduct(p) {
  const rating = p.rating || {};
  return {
    id: p.id,
    name: p.title || p.name || '',
    category: p.category || '',
    price: Number(p.price) || 0,
    rating: Number(rating.rate) || 0,
    reviewCount: Number(rating.count) || 0,
    image: p.image || '',
    description: p.description || '',
  };
}

export async function fetchProducts(category) {
  let apiProducts = [];
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      apiProducts = (Array.isArray(data) ? data : []).map(normalizeProduct);
    }
  } catch (e) {
    console.warn('API fetch failed, using extra products only');
  }

  const all = [...apiProducts, ...extraProducts];

  if (category && category !== 'All') {
    const c = category.toLowerCase();
    return all.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      if (c === 'shirt') return cat === 'shirt';
      if (c === 't-shirt' || c === 'tshirt') return cat === 't-shirt';
      if (c === 'electronics') return cat === 'electronics';
      return cat.includes(c) || c.includes(cat);
    });
  }
  return all;
}
