// Product catalog with reviews and ratings
const products = [
  { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', price: 89.99, rating: 4.5, reviewCount: 234, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop', description: 'Premium sound quality, 30hr battery, noise cancellation' },
  { id: 2, name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 129.99, rating: 4.7, reviewCount: 412, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop', description: 'RGB backlight, Cherry MX switches, programmable keys' },
  { id: 3, name: 'USB-C Fast Charging Cable Pack', category: 'Electronics', price: 19.99, rating: 4.3, reviewCount: 1890, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop', description: '2-pack, 100W power delivery, braided nylon' },
  { id: 4, name: 'Portable Power Bank 20000mAh', category: 'Electronics', price: 45.99, rating: 4.6, reviewCount: 567, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop', description: 'Fast charging, dual USB, compact design' },
  { id: 5, name: 'Laptop Stand Aluminum', category: 'Electronics', price: 49.99, rating: 4.4, reviewCount: 312, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop', description: 'Ergonomic, adjustable height, heat dissipation' },
  { id: 6, name: 'Wireless Mouse Ergonomic', category: 'Electronics', price: 34.99, rating: 4.2, reviewCount: 892, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop', description: 'Silent click, 6 buttons, 2.4GHz wireless' },
  { id: 7, name: 'Smart Watch Fitness Tracker', category: 'Electronics', price: 79.99, rating: 4.1, reviewCount: 1203, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', description: 'Heart rate, sleep, 50+ sports modes' },
  { id: 8, name: '4K Webcam for Streaming', category: 'Electronics', price: 149.99, rating: 4.8, reviewCount: 278, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=300&h=300&fit=crop', description: 'Autofocus, ring light, built-in mic' },
  { id: 9, name: 'Desk Lamp LED', category: 'Home', price: 39.99, rating: 4.5, reviewCount: 445, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop', description: 'Dimmable, USB charger, eye care' },
  { id: 10, name: 'Cotton T-Shirt Premium', category: 'Clothing', price: 24.99, rating: 4.6, reviewCount: 2103, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', description: 'Organic cotton, slim fit, various colors' },
  { id: 11, name: 'Running Shoes Lightweight', category: 'Footwear', price: 89.99, rating: 4.4, reviewCount: 678, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', description: 'Breathable mesh, cushion sole, trail ready' },
  { id: 12, name: 'Leather Backpack', category: 'Bags', price: 69.99, rating: 4.7, reviewCount: 534, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop', description: '15" laptop compartment, water resistant' },
  { id: 13, name: 'Insulated Water Bottle 1L', category: 'Home', price: 29.99, rating: 4.5, reviewCount: 1892, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop', description: 'Stainless steel, keeps cold 24hr' },
  { id: 14, name: 'Yoga Mat 6mm', category: 'Sports', price: 34.99, rating: 4.3, reviewCount: 756, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop', description: 'Non-slip, eco-friendly, carry strap' },
  { id: 15, name: 'Bluetooth Speaker Portable', category: 'Electronics', price: 59.99, rating: 4.4, reviewCount: 923, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', description: '360° sound, 12hr battery, waterproof' },
  { id: 16, name: 'Tablet Stand Foldable', category: 'Electronics', price: 22.99, rating: 4.2, reviewCount: 401, image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=300&fit=crop', description: 'Multi-angle, aluminum, portable' },
  { id: 17, name: 'Slim Wallet RFID Blocking', category: 'Accessories', price: 28.99, rating: 4.6, reviewCount: 612, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&h=300&fit=crop', description: 'Leather, 8 card slots, money clip' },
  { id: 18, name: 'Screen Cleaning Kit', category: 'Electronics', price: 14.99, rating: 4.1, reviewCount: 2104, image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=300&fit=crop', description: 'Microfiber cloth, spray, safe for all screens' },
  { id: 19, name: 'Wireless Earbuds', category: 'Electronics', price: 49.99, rating: 4.0, reviewCount: 1567, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop', description: 'Bluetooth 5.0, touch controls, 20hr case' },
  { id: 20, name: 'Premium Coffee Maker', category: 'Home', price: 99.99, rating: 4.7, reviewCount: 389, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop', description: 'Programmable, thermal carafe, 12-cup' },
];

// Sample reviews for recommendation engine (sentiment / keywords)
const reviews = {
  1: [
    { text: 'Best headphones I\'ve ever owned. Sound is incredible.', rating: 5 },
    { text: 'Great value for the price. Noise canceling works well.', rating: 5 },
    { text: 'Comfortable for long sessions. Battery lasts forever.', rating: 4 },
    { text: 'Good but a bit heavy after 2 hours.', rating: 4 },
  ],
  2: [
    { text: 'Amazing keyboard. Typing feels so smooth.', rating: 5 },
    { text: 'Best gaming keyboard under $150. RGB is beautiful.', rating: 5 },
    { text: 'Solid build. Worth every penny.', rating: 5 },
    { text: 'Great for both work and gaming.', rating: 4 },
  ],
  3: [
    { text: 'Charges my laptop super fast. Great cables.', rating: 5 },
    { text: 'Cheap and reliable. Exactly what I needed.', rating: 5 },
    { text: 'Good quality for the price.', rating: 4 },
  ],
  4: [
    { text: 'Holds charge forever. Charges my phone 4 times.', rating: 5 },
    { text: 'Compact and powerful. Perfect for travel.', rating: 5 },
    { text: 'Best power bank I\'ve bought. Fast charging works.', rating: 5 },
  ],
  5: [
    { text: 'Ergonomic and sturdy. My neck feels better.', rating: 5 },
    { text: 'Simple and effective. Good build quality.', rating: 4 },
    { text: 'Worth the investment for desk setup.', rating: 5 },
  ],
  6: [
    { text: 'Silent and responsive. Perfect for office.', rating: 4 },
    { text: 'Good battery life. Comfortable grip.', rating: 4 },
  ],
  7: [
    { text: 'Accurate heart rate. Sleep tracking is useful.', rating: 4 },
    { text: 'Great fitness features for the price.', rating: 5 },
  ],
  8: [
    { text: 'Crystal clear video. Best webcam I\'ve used.', rating: 5 },
    { text: 'Ring light is a game changer. Highly recommend.', rating: 5 },
  ],
  9: [
    { text: 'Nice warm light. USB port is handy.', rating: 5 },
    { text: 'Adjustable and doesn\'t take space.', rating: 4 },
  ],
  10: [
    { text: 'Soft fabric. Fits true to size.', rating: 5 },
    { text: 'Great quality t-shirt. Will buy more.', rating: 5 },
  ],
  11: [
    { text: 'Light and comfortable. Good for daily runs.', rating: 5 },
    { text: 'Great cushioning. No foot pain.', rating: 4 },
  ],
  12: [
    { text: 'Premium leather. Lots of pockets.', rating: 5 },
    { text: 'Best backpack for daily commute.', rating: 5 },
  ],
  13: [
    { text: 'Keeps water cold all day. Durable.', rating: 5 },
    { text: 'Leak proof. Perfect for gym.', rating: 5 },
  ],
  14: [
    { text: 'Thick and stable. No slipping.', rating: 4 },
    { text: 'Good for yoga and exercises.', rating: 5 },
  ],
  15: [
    { text: 'Loud and clear. Waterproof is a plus.', rating: 5 },
    { text: 'Great for outdoor use. Battery lasts.', rating: 4 },
  ],
  16: [{ text: 'Sturdy and adjustable.', rating: 4 }],
  17: [{ text: 'Slim design. RFID works.', rating: 5 }],
  18: [{ text: 'Cleans well. Safe on screens.', rating: 4 }],
  19: [
    { text: 'Good sound for the price.', rating: 4 },
    { text: 'Battery life is decent.', rating: 4 },
  ],
  20: [
    { text: 'Best coffee maker. Brews perfectly.', rating: 5 },
    { text: 'Programmable. Easy to use.', rating: 5 },
  ],
};

module.exports = { products, reviews };
