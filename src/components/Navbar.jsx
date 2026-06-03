import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, Heart, ShoppingBag, User, Sun, Moon, 
  Menu, X, Trash2, Plus, Minus, Settings, LogOut, Sparkles 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    cart, wishlist, user, logoutUser, updateQuantity, 
    removeFromCart, getSubtotal, getSearchSuggestions 
  } = useShop();
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Scroll handler for sticky styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate cart button when items count changes
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  useEffect(() => {
    if (cartItemsCount > 0) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  // Click outside search auto-suggestions handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSuggestions(getSearchSuggestions(val));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const selectSuggestion = (sug) => {
    setSearchQuery(sug);
    setIsSearchFocused(false);
    navigate(`/shop?search=${encodeURIComponent(sug)}`);
  };

  const subtotal = getSubtotal();

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo */}
          <Link to="/" className="logo">
            AURA <span>WEAR</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            {user?.isAdmin ? (
              <>
                <Link to="/admin" className="nav-link nav-link-admin">Overview</Link>
                <Link to="/admin/products" className="nav-link nav-link-admin">Products</Link>
                <Link to="/admin/orders" className="nav-link nav-link-admin">Orders</Link>
                <Link to="/admin/coupons" className="nav-link nav-link-admin">Coupons</Link>
              </>
            ) : (
              <>
                <Link to="/shop?category=Men" className="nav-link">Men</Link>
                <Link to="/shop?category=Women" className="nav-link">Women</Link>
                <Link to="/shop?category=Kids" className="nav-link">Kids</Link>
                <Link to="/about" className="nav-link">Our Story</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
              </>
            )}
          </nav>

          {/* Search Bar */}
          <form ref={searchRef} className="search-form" onSubmit={handleSearchSubmit}>
            <div className={`search-input-wrapper ${isSearchFocused ? 'focused' : ''}`}>
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Smart AI Search (e.g. formal, cotton...)"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                className="search-input"
              />
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(''); setSuggestions([]); }} className="clear-search">
                  <X size={14} />
                </button>
              )}
            </div>
            {isSearchFocused && suggestions.length > 0 && (
              <div className="search-suggestions animate-scale-in">
                <div className="suggestions-header">
                  <Sparkles size={12} className="ai-icon" /> AI Suggestions
                </div>
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="suggestion-item" onClick={() => selectSuggestion(sug)}>
                    {sug}
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Action Icons */}
          <div className="nav-actions">
            <button onClick={toggleTheme} className="icon-btn theme-toggle" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user?.isAdmin ? (
              <Link to="/admin" className="icon-btn admin-link" title="Admin Panel">
                <Settings size={20} />
              </Link>
            ) : (
              <Link to="/dashboard" className="icon-btn" title="My Account">
                <User size={20} />
              </Link>
            )}

            <Link to="/wishlist" className="icon-btn wishlist-icon" title="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)} 
              className={`icon-btn cart-icon ${isCartBouncing ? 'bounce' : ''}`} 
              title="Cart"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && <span className="badge-count">{cartItemsCount}</span>}
            </button>

            {user && (
              <button 
                onClick={() => { logoutUser(); navigate('/'); }} 
                className="icon-btn logout-desktop-btn" 
                title="Log Out"
                style={{ color: '#c93b3b' }}
              >
                <LogOut size={20} />
              </button>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="icon-btn mobile-menu-btn">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div className={`drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Shopping Cart ({cartItemsCount})</h3>
            <button onClick={() => setIsCartOpen(false)} className="close-btn"><X size={20} /></button>
          </div>

          {cart.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={48} className="empty-icon" />
              <p>Your cart is empty</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }} 
                className="btn btn-primary"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <>
              <div className="drawer-items">
                {cart.map((item) => (
                  <div key={item.key} className="drawer-item">
                    <img src={item.image} alt={item.name} className="item-img" />
                    <div className="item-details">
                      <h4 className="item-title">{item.name}</h4>
                      <p className="item-meta">Size: {item.size} | Color: {item.color}</p>
                      <div className="item-price-quantity">
                        <span className="item-price">₹{item.price}</span>
                        <div className="quantity-ctrl">
                          <button onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.key)} className="item-remove">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="drawer-footer">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <p className="footer-notice">Taxes and shipping calculated at checkout.</p>
                <div className="drawer-actions">
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/cart'); }} 
                    className="btn btn-secondary w-full"
                  >
                    View Cart
                  </button>
                  <button 
                    onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} 
                    className="btn btn-primary w-full"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>Menu</h3>
            <button onClick={() => setIsMobileMenuOpen(false)} className="close-btn"><X size={20} /></button>
          </div>
          <div className="mobile-nav-links">
            {user?.isAdmin ? (
              <>
                <div className="mobile-admin-header">Admin Workspace</div>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Admin Overview</Link>
                <Link to="/admin/products" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Products Catalog</Link>
                <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Order Dispatch</Link>
                <Link to="/admin/coupons" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Discounts & Coupons</Link>
                <div className="divider"></div>
                <div className="mobile-admin-header">Storefront View</div>
                <Link to="/shop?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Men's Clothing</Link>
                <Link to="/shop?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Women's Clothing</Link>
                <Link to="/shop?category=Kids" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Kid's Clothing</Link>
              </>
            ) : (
              <>
                <Link to="/shop?category=Men" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Men's Clothing</Link>
                <Link to="/shop?category=Women" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Women's Clothing</Link>
                <Link to="/shop?category=Kids" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Kid's Clothing</Link>
                <div className="divider"></div>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Our Story</Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">Contact Us</Link>
              </>
            )}
            <div className="divider"></div>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link">My Account Dashboard</Link>
                <div onClick={() => { setIsMobileMenuOpen(false); logoutUser(); navigate('/'); }} className="mobile-link logout-link">
                  <LogOut size={16} /> Logout
                </div>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-link auth-button">Sign In / Register</Link>
            )}
          </div>
        </div>
      </div>

      {/* Styles for Navbar Component */}
      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--nav-height);
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          z-index: 100;
          transition: var(--transition-normal);
          display: flex;
          align-items: center;
        }
        .header.scrolled {
          background-color: var(--bg-primary);
          border-bottom: 1px solid var(--border-color);
          height: 70px;
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }
        .logo span {
          color: var(--accent-color);
          font-weight: 300;
        }
        .desktop-nav {
          display: flex;
          gap: 32px;
        }
        .nav-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
        .search-form {
          position: relative;
          width: 280px;
        }
        @media (max-width: 992px) {
          .desktop-nav, .search-form {
            display: none;
          }
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          transition: var(--transition-fast);
        }
        .search-input-wrapper.focused {
          background-color: var(--bg-primary);
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px var(--accent-light);
        }
        .search-icon {
          color: var(--text-muted);
        }
        .search-input {
          font-size: 0.85rem;
          width: 100%;
        }
        .clear-search {
          color: var(--text-muted);
        }
        .search-suggestions {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 110;
          overflow: hidden;
        }
        .suggestions-header {
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent-color);
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .suggestion-item {
          padding: 10px 12px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .suggestion-item:hover {
          background-color: var(--bg-secondary);
          color: var(--accent-color);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-btn {
          position: relative;
          color: var(--text-secondary);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        .icon-btn:hover {
          color: var(--text-primary);
        }
        .badge-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: var(--accent-color);
          color: var(--accent-text);
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }
        .mobile-menu-btn {
          display: none;
        }
        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: flex;
          }
          .theme-toggle, .wishlist-icon, .logout-desktop-btn {
            display: none !important;
          }
        }
        /* Drawers Base */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(28, 24, 20, 0.4);
          z-index: 200;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-normal);
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .cart-drawer, .mobile-drawer {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 440px;
          height: 100%;
          background-color: var(--bg-primary);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform var(--transition-normal);
        }
        .mobile-drawer {
          left: 0;
          right: auto;
          transform: translateX(-100%);
          max-width: 320px;
        }
        .drawer-overlay.open .cart-drawer {
          transform: translateX(0);
        }
        .drawer-overlay.open .mobile-drawer {
          transform: translateX(0);
        }
        .drawer-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .close-btn {
          color: var(--text-secondary);
        }
        .close-btn:hover {
          color: var(--text-primary);
        }
        /* Cart drawer content */
        .drawer-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          gap: 16px;
        }
        .empty-icon {
          color: var(--text-muted);
        }
        .drawer-items {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .drawer-item {
          display: flex;
          gap: 16px;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }
        .item-img {
          width: 80px;
          height: 90px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .item-title {
          font-size: 0.9rem;
          font-weight: 600;
          line-height: 1.3;
        }
        .item-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .item-price-quantity {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
        }
        .item-price {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .quantity-ctrl {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 2px;
          background-color: var(--bg-secondary);
        }
        .quantity-ctrl button {
          padding: 2px 6px;
          display: flex;
          align-items: center;
        }
        .quantity-ctrl span {
          font-size: 0.85rem;
          width: 24px;
          text-align: center;
        }
        .item-remove {
          position: absolute;
          top: 0;
          right: 0;
          color: var(--text-muted);
        }
        .item-remove:hover {
          color: #c93b3b;
        }
        .drawer-footer {
          padding: 24px;
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }
        .subtotal-row {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 8px;
        }
        .footer-notice {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }
        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .w-full {
          width: 100%;
        }
        /* Mobile menu links */
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          padding: 24px;
          gap: 20px;
        }
        .mobile-link {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .mobile-link:hover {
          color: var(--text-primary);
        }
        .logout-link {
          color: #c93b3b;
          cursor: pointer;
        }
        .auth-button {
          margin-top: 10px;
          background-color: var(--accent-color);
          color: var(--accent-text);
          padding: 12px;
          border-radius: var(--radius-md);
          justify-content: center;
        }
        .divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 10px 0;
        }
        @keyframes navCartBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .icon-btn.cart-icon.bounce {
          animation: navCartBounce 0.3s ease;
        }
        .nav-link-admin {
          color: var(--accent-color) !important;
          font-weight: 600;
        }
        .mobile-admin-header {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--accent-color);
          font-weight: 700;
          letter-spacing: 0.05em;
          margin-top: 4px;
          margin-bottom: -4px;
        }
      `}</style>
    </>
  );
};
