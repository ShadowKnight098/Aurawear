import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Trash2, Plus, Minus, ArrowRight, Heart, Sparkles, AlertCircle } from 'lucide-react';

export const CartPage = () => {
  const {
    cart, updateQuantity, removeFromCart, getSubtotal, 
    getShipping, couponCode, discountPercent, discountAmount, 
    applyCoupon, removeCoupon, wishlist, toggleWishlist, 
    recentlyViewed, products
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ type: '', text: '' });
  const [prevCouponCode, setPrevCouponCode] = useState(couponCode);
  const navigate = useNavigate();

  // Watch for auto-removal of coupon
  useEffect(() => {
    if (prevCouponCode && !couponCode) {
      setPromoMsg({ 
        type: 'error', 
        text: 'Applied coupon was removed because your cart no longer meets the coupon conditions.' 
      });
    }
    setPrevCouponCode(couponCode);
  }, [couponCode, prevCouponCode]);

  const subtotal = getSubtotal();
  const shipping = getShipping(subtotal);
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyCoupon(promoInput);
    if (res.success) {
      setPromoMsg({ type: 'success', text: `Promo Code Applied! Enjoy ${res.discountPercent}% Off.` });
      setPromoInput('');
    } else {
      setPromoMsg({ type: 'error', text: res.message });
    }
  };

  // Recently Viewed product list
  const recentlyViewedProducts = (products || []).filter(p => (recentlyViewed || []).includes(p.id) && !(cart || []).some(c => c.id === p.id)).slice(0, 4);

  return (
    <div className="cart-page-wrapper section-padding">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>
        
        {(cart || []).length === 0 ? (
          <div className="empty-cart-view animate-scale-in">
            <AlertCircle size={48} className="text-muted" />
            <h2>Your shopping cart is empty</h2>
            <p>Fill it with our premium, minimal organic clothing essentials.</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Items List */}
            <div className="cart-items-panel">
              {(cart || []).map((item) => (
                <div key={item.key} className="cart-item-row animate-fade-in">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`} className="item-name-link">
                      <h3>{item.name}</h3>
                    </Link>
                    <p className="item-variants">Size: <strong>{item.size}</strong> | Color: <strong>{item.color}</strong></p>
                    
                    <div className="cart-qty-price-row">
                      <div className="quantity-ctrl">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <span className="cart-item-price">₹{item.price * item.quantity}</span>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <button 
                      onClick={() => {
                        toggleWishlist(item.id);
                        removeFromCart(item.key);
                      }} 
                      className="btn-save-wishlist"
                      title="Move to Wishlist"
                    >
                      <Heart size={16} /> Save for later
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.key)} 
                      className="btn-remove-item"
                      title="Remove Item"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary sidebar */}
            <aside className="cart-summary-sidebar">
              <div className="summary-box">
                <h3>Order Summary</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  {couponCode && (
                    <div className="summary-row promo-discount-row">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="shipping-hint text-muted">Add ₹{1500 - subtotal} more to qualify for FREE shipping!</p>
                  )}

                  <div className="divider"></div>

                  <div className="summary-row total-row">
                    <span>Estimated Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                {/* Promo application Form */}
                <div className="promo-code-box">
                  <h4>Have a Promo Code?</h4>
                  {couponCode ? (
                    <div className="active-coupon-pill animate-fade-in">
                      <span><Sparkles size={14} /> {couponCode} Applied</span>
                      <button onClick={removeCoupon}>Remove</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="promo-form">
                      <input 
                        type="text" 
                        placeholder="e.g. SUMMER10"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value);
                          setPromoMsg({ type: '', text: '' });
                        }}
                        className="form-input promo-input"
                      />
                      <button type="submit" className="btn btn-outline btn-sm">Apply</button>
                    </form>
                  )}
                  {promoMsg.text && (
                    <p className={`promo-feedback-msg ${promoMsg.type}`}>
                      {promoMsg.text}
                    </p>
                  )}
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={() => navigate('/checkout')} 
                  className="btn btn-primary w-full checkout-cta"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Recently Viewed Panel */}
        {recentlyViewedProducts.length > 0 && (
          <section className="section-padding recently-viewed-section">
            <h2>Recently Viewed</h2>
            <p className="text-secondary mb-24">Pick up right where you left off browsing.</p>
            <div className="products-grid-home">
              {recentlyViewedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .cart-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .empty-cart-view {
          text-align: center;
          padding: 80px 40px;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-cart-view p {
          color: var(--text-secondary);
          max-width: 400px;
          margin-bottom: 8px;
        }

        .cart-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
        }
        
        /* Items list */
        .cart-items-panel {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-primary);
          overflow: hidden;
        }
        .cart-item-row {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 20px;
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        @media (max-width: 576px) {
          .cart-item-row {
            grid-template-columns: 80px 1fr;
            gap: 16px;
            padding: 16px;
          }
        }
        .cart-item-row:last-child {
          border-bottom: none;
        }
        .cart-item-img {
          width: 100px;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-md);
        }
        @media (max-width: 576px) {
          .cart-item-img {
            width: 80px;
            height: 95px;
          }
        }
        .cart-item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .item-name-link h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .item-name-link:hover h3 {
          color: var(--accent-color);
        }
        .item-variants {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .cart-qty-price-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 12px;
        }
        .cart-item-price {
          font-weight: 700;
          font-size: 1.1rem;
        }
        
        .cart-item-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
        }
        @media (max-width: 576px) {
          .cart-item-actions {
            grid-column: 1 / -1;
            flex-direction: row;
            border-top: 1px solid var(--border-color);
            padding-top: 12px;
            justify-content: flex-start;
          }
        }
        .btn-save-wishlist, .btn-remove-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          transition: var(--transition-fast);
        }
        .btn-save-wishlist:hover {
          color: var(--accent-color);
        }
        .btn-remove-item:hover {
          color: #c93b3b;
        }
        
        /* Summary sidebar */
        .cart-summary-sidebar {
          position: sticky;
          top: calc(var(--nav-height) + 20px);
        }
        .summary-box {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }
        .summary-box h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .summary-rows {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .shipping-hint {
          font-size: 0.75rem;
          margin-top: -6px;
        }
        .promo-discount-row {
          color: #248a52;
          font-weight: 500;
        }
        .total-row {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        
        .promo-code-box {
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 20px 0;
          margin-bottom: 24px;
        }
        .promo-code-box h4 {
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        .promo-form {
          display: flex;
          gap: 8px;
        }
        .promo-input {
          text-transform: uppercase;
        }
        .active-coupon-pill {
          background-color: #e3f5eb;
          color: #248a52;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .active-coupon-pill button {
          color: #c93b3b;
          font-size: 0.75rem;
          text-decoration: underline;
        }
        .promo-feedback-msg {
          font-size: 0.8rem;
          margin-top: 8px;
          font-weight: 500;
        }
        .promo-feedback-msg.success { color: #248a52; }
        .promo-feedback-msg.error { color: #c93b3b; }
        
        .checkout-cta {
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};
