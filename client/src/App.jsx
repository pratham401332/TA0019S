import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Chatbox from './components/Chatbox';
import Cart from './components/Cart';
import { fetchProducts } from './api';
import './styles.css';

const CATEGORIES = ['All', 'Electronics', 'Shirt', 'T-Shirt', 'jewelery', "men's clothing", "women's clothing"];

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [chatOpen, setChatOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState({});
  const [toast, setToast] = useState(null);

  function addToCart(product) {
    setCart((prev) => {
      const id = product.id;
      const existing = prev[id];
      return {
        ...prev,
        [id]: {
          ...product,
          qty: (existing?.qty || 0) + 1,
        },
      };
    });
    setToast('Item added to your cart');
    setTimeout(() => setToast(null), 2500);
  }

  function updateCartQty(id, qty) {
    if (qty < 1) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    setCart((prev) => ({
      ...prev,
      [id]: { ...prev[id], qty },
    }));
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts(category);
      setProducts(data);
    } catch (e) {
      setProducts([]);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  const q = (search || '').toLowerCase();
  const filtered = q
    ? products.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      )
    : products;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-top">
            <h1 className="logo">Orange</h1>
            <button className="cart-icon-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <span className="cart-icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
          <p className="tagline">Fresh picks, smart recommendations</p>
          <div className="search-bar">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="main">
        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {filtered.length ? (
              filtered.map((p) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)
            ) : (
              <div className="empty">No products found. Try the Orange assistant!</div>
            )}
          </div>
        )}
      </main>

      <Chatbox
        open={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        onProductClick={() => setChatOpen(false)}
        onAddToCart={addToCart}
      />

      {toast && <div className="toast">{toast}</div>}

      {cartOpen && (
        <Cart
          cart={cart}
          onUpdateQty={updateCartQty}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={clearCart}
        />
      )}
    </div>
  );
}
