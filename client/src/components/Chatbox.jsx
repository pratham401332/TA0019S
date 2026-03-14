import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../api';
import { suggestProducts } from '../chatLogic';

export default function Chatbox({ open, onToggle, onProductClick, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your Orange assistant. I suggest products and share tips like price trends, upcoming Diwali/Summer sales, limited stock alerts & more. Try: 'electronics under $100' or 'best jewelry'." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [bestPick, setBestPick] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, suggestedProducts]);

  function sendMessage(e) {
    e?.preventDefault?.();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    setSuggestedProducts([]);
    setBestPick(null);

    setTimeout(() => {
      const suggestions = suggestProducts(products, text);
      const best = suggestions[0] || null;

      let reply = '';
      if (suggestions.length === 0) {
        reply = "I couldn't find matching products. Try 'electronics', 'jewelry under $50', or 'best rated'.";
      } else if (best) {
        const rating = best.rating || 0;
        const count = best.reviewCount || 0;
        const tip = (best.tips || [])[0];
        reply = `I found ${suggestions.length} option${suggestions.length > 1 ? 's' : ''}. My top pick: **${best.name}** — $${(best.price || 0).toFixed(2)}, rated ${rating}★ (${count} reviews).${tip ? ` ${tip}` : ''}`;
      } else {
        reply = `Here are ${suggestions.length} products that match:`;
      }

      setBestPick(best);
      setSuggestedProducts(suggestions);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 600);
  }

  return (
    <>
      <button className="chat-toggle" onClick={onToggle} aria-label="Open Orange assistant">
        <span className="orange-icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" width="32" height="32">
            <circle cx="24" cy="26" r="18" fill="#ff8c00" stroke="#e67e00" strokeWidth="1.5" />
            <ellipse cx="24" cy="24" rx="14" ry="12" fill="#ffa500" opacity="0.85" />
            <path d="M24 8 Q28 4 24 2 Q20 4 24 8" fill="#228b22" stroke="#1a6b1a" strokeWidth="1" />
          </svg>
        </span>
        <span className="chat-label">Orange</span>
      </button>

      <div className={`chatbox ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <div>
            <h3>
              <span className="orange-icon-small">🍊</span> Orange Assistant
            </h3>
            <p>Get personalized recommendations</p>
          </div>
          <button className="chat-close" onClick={onToggle} aria-label="Close">×</button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-bubble">
                {m.text.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg assistant">
              <div className="msg-bubble typing">Finding the best picks...</div>
            </div>
          )}

          {suggestedProducts.length > 0 && (
            <div className="chat-products">
              {bestPick && (
                <div className="best-pick-banner">🏆 Best pick based on ratings</div>
              )}
              <div className="chat-product-grid">
                {suggestedProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`chat-product-item ${bestPick?.id === p.id ? 'best' : ''}`}
                    onClick={onProductClick}
                  >
                    {bestPick?.id === p.id && <span className="best-badge">Top Pick</span>}
                    <ProductCard product={p} onAddToCart={onAddToCart} />
                    {p.tips && p.tips.length > 0 && (
                      <div className="product-tips">
                        {p.tips.map((tip, i) => (
                          <span key={i} className="product-tip">💡 {tip}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="e.g. electronics under $100, best jewelry..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>Send</button>
        </form>
      </div>
    </>
  );
}
