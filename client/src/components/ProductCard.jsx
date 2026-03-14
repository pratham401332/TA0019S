import React from 'react';

const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect fill="#fff5e6" width="300" height="300"/><text x="150" y="155" fill="#ff8c00" font-family="sans-serif" font-size="14" text-anchor="middle">No image</text></svg>');

export default function ProductCard({ product, onAddToCart }) {
  const name = product.name || product.title || '';
  const price = Number(product.price) || 0;
  const rating = product.rating?.rate ?? product.rating ?? 0;
  const reviewCount = product.rating?.count ?? product.reviewCount ?? 0;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={name} loading="lazy" onError={(e) => { e.target.src = PLACEHOLDER; }} />
      </div>
      <div className="product-info">
        <span className="category">{product.category || ''}</span>
        <h3>{name}</h3>
        <p className="description">{(product.description || '').slice(0, 100)}...</p>
        <div className="product-footer">
          <div className="rating">
            <span className="stars">★</span>
            <span>{rating}</span>
            {reviewCount > 0 && <span className="reviews">({reviewCount})</span>}
          </div>
          <span className="price">${price.toFixed(2)}</span>
        </div>
        <button type="button" className="btn-add-cart" onClick={() => onAddToCart && onAddToCart(product)}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}
