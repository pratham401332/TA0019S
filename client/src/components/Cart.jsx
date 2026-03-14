import React, { useState } from 'react';

export default function Cart({ cart, onUpdateQty, onRemove, onClose, onCheckout }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);

  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) return;
    setOrderPlaced(true);
    setTimeout(() => {
      onCheckout();
      setCheckoutOpen(false);
      setOrderPlaced(false);
      setForm({ name: '', email: '', address: '' });
    }, 2500);
  }

  if (orderPlaced) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-drawer order-success" onClick={(e) => e.stopPropagation()}>
          <div className="order-success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Thank you for your purchase. We'll send a confirmation to {form.email}.</p>
        </div>
      </div>
    );
  }

  if (checkoutOpen) {
    return (
      <div className="cart-overlay" onClick={onClose}>
        <div className="cart-drawer checkout-form" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h2>Checkout</h2>
            <button className="cart-close-btn" onClick={() => setCheckoutOpen(false)}>← Back</button>
          </div>
          <form onSubmit={handleSubmit} className="checkout-fields">
            <label>
              Full Name *
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="John Doe" />
            </label>
            <label>
              Email *
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required placeholder="john@example.com" />
            </label>
            <label>
              Shipping Address *
              <textarea value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required placeholder="123 Main St, City, State, ZIP" rows={3} />
            </label>
            <div className="checkout-total">Total: ${total.toFixed(2)}</div>
            <button type="submit" className="btn-place-order">Place Order</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h2>Your Cart {count > 0 && <span className="cart-count-badge">{count}</span>}</h2>
          <button className="cart-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} />
                </div>
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-qty">
                    <button type="button" onClick={() => onUpdateQty(item.id, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                    <button type="button" className="cart-remove" onClick={() => onRemove(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">Subtotal: <strong>${total.toFixed(2)}</strong></div>
            <button className="btn-checkout" onClick={() => setCheckoutOpen(true)}>Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}
