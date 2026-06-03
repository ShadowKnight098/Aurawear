import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star, Check, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductCard = ({ product }) => {
  const { 
    cart, wishlist, toggleWishlist, addToCart, 
    compareList, toggleComparison 
  } = useShop();
  
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Black');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const inCart = cart.some(item => item.id === product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComparison(product);
  };

  return (
    <>
      <div className="product-card">
        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist} 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          aria-label="Add to Wishlist"
        >
          <Heart size={18} fill={isWishlisted ? "var(--accent-color)" : "none"} />
        </button>

        {/* Comparison Button */}
        <button 
          onClick={handleCompare} 
          className={`compare-btn ${isCompared ? 'active' : ''}`}
          title="Compare Product"
        >
          <RefreshCw size={14} />
        </button>

        <Link to={`/product/${product.id}`} className="card-link">
          {/* Image & Badges */}
          <div className="img-container">
            <img src={product.images[0]} alt={product.name} className="product-img" />
            {product.images[1] && (
              <img src={product.images[1]} alt={product.name} className="product-img-hover" />
            )}
            
            {/* Badges */}
            <div className="card-badges">
              {product.discountBadge && (
                <span className="badge badge-discount">{product.discountBadge}</span>
              )}
              {product.stock <= 5 && (
                <span className="badge badge-status">Only {product.stock} Left</span>
              )}
            </div>

            {/* Quick Actions Hover Overlay */}
            <div className="hover-actions">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsQuickViewOpen(true); }} 
                className="btn btn-secondary quick-view-trigger"
              >
                <Eye size={16} /> Quick View
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="card-info">
            <span className="card-category">{product.category}'s {product.subCategory}</span>
            <h3 className="card-title">{product.name}</h3>

            {/* Ratings */}
            <div className="card-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(product.rating) ? "#ffc107" : "none"}
                    stroke={i < Math.floor(product.rating) ? "#ffc107" : "var(--text-muted)"}
                  />
                ))}
              </div>
              <span className="rating-val">({product.reviewsCount})</span>
            </div>

            {/* Price Row */}
            <div className="card-price-row">
              <div className="price-box">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">₹{product.originalPrice}</span>
                )}
              </div>
              <button 
                onClick={handleAddToCart}
                className={`card-cart-btn ${isAdded ? 'success' : ''}`}
                aria-label="Add to cart"
              >
                {isAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <div className="modal-overlay" onClick={() => setIsQuickViewOpen(false)}>
          <div className="modal-content quick-view-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsQuickViewOpen(false)} className="modal-close">&times;</button>
            <div className="quick-view-grid">
              <div className="qv-images">
                <img src={product.images[0]} alt={product.name} className="qv-main-img" />
              </div>
              <div className="qv-details">
                <span className="qv-category">{product.category} | {product.subCategory}</span>
                <h2 className="qv-title">{product.name}</h2>
                
                <div className="qv-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.floor(product.rating) ? "#ffc107" : "none"}
                        stroke={i < Math.floor(product.rating) ? "#ffc107" : "var(--text-muted)"}
                      />
                    ))}
                  </div>
                  <span>({product.reviewsCount} reviews)</span>
                </div>

                <div className="qv-price">
                  <span className="current-price">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">₹{product.originalPrice}</span>
                  )}
                  {product.discountBadge && (
                    <span className="badge badge-discount">{product.discountBadge}</span>
                  )}
                </div>

                <p className="qv-desc">{product.description}</p>

                {/* Variants Selection */}
                <div className="qv-variants">
                  <div className="variant-select">
                    <span className="variant-label">Size:</span>
                    <div className="variant-options">
                      {product.sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`variant-opt size-opt ${selectedSize === size ? 'active' : ''}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="variant-select">
                    <span className="variant-label">Color:</span>
                    <div className="variant-options">
                      {product.colors.map(color => (
                        <button 
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`variant-opt color-opt ${selectedColor === color ? 'active' : ''}`}
                          style={{ borderColor: selectedColor === color ? 'var(--accent-color)' : 'transparent' }}
                        >
                          <span className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="qv-actions">
                  <button onClick={handleAddToCart} className="btn btn-primary qv-cart-btn">
                    {isAdded ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => { setIsQuickViewOpen(false); navigate(`/product/${product.id}`); }} 
                    className="btn btn-secondary"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .product-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-card-hover);
        }
        .card-link {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .wishlist-btn, .compare-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-primary);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          z-index: 10;
          border: 1px solid var(--border-color);
          transition: var(--transition-fast);
        }
        .compare-btn {
          right: auto;
          left: 14px;
          width: 28px;
          height: 28px;
        }
        .wishlist-btn:hover {
          color: #c93b3b;
          transform: scale(1.1);
        }
        .wishlist-btn.active {
          color: var(--accent-color);
          border-color: var(--accent-color);
        }
        .compare-btn:hover, .compare-btn.active {
          color: var(--accent-color);
          border-color: var(--accent-color);
        }
        .img-container {
          position: relative;
          padding-top: 120%; /* 4:5 aspect ratio */
          overflow: hidden;
          background-color: var(--bg-secondary);
        }
        .product-img, .product-img-hover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .product-img-hover {
          opacity: 0;
        }
        .product-card:hover .product-img-hover {
          opacity: 1;
        }
        .product-card:hover .product-img {
          opacity: 0;
        }
        .card-badges {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 5;
        }
        .hover-actions {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(28, 24, 20, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--transition-fast);
          z-index: 4;
        }
        .product-card:hover .hover-actions {
          opacity: 1;
        }
        .quick-view-trigger {
          transform: translateY(15px);
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .product-card:hover .quick-view-trigger {
          transform: translateY(0);
        }
        .card-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .card-category {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .card-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.7em;
        }
        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .stars {
          display: flex;
          gap: 2px;
        }
        .rating-val {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .card-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .price-box {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .current-price {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
        }
        .original-price {
          font-size: 0.85rem;
          text-decoration: line-through;
          color: var(--text-muted);
        }
        .card-cart-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--accent-color);
          color: var(--accent-text);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }
        .card-cart-btn:hover {
          background-color: var(--accent-hover);
          transform: scale(1.08);
        }
        .card-cart-btn.success {
          background-color: #248a52;
        }

        /* Modal styling */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(28, 24, 20, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 300;
          padding: 20px;
        }
        .modal-content {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          max-width: 900px;
          width: 100%;
          position: relative;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          font-size: 2rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          z-index: 10;
        }
        .modal-close:hover {
          color: var(--text-primary);
        }
        .quick-view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .quick-view-grid {
            grid-template-columns: 1fr;
          }
          .qv-images {
            height: 300px;
          }
        }
        .qv-images {
          background-color: var(--bg-secondary);
        }
        .qv-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .qv-details {
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          max-height: 80vh;
        }
        @media (max-width: 768px) {
          .qv-details {
            padding: 24px;
          }
        }
        .qv-category {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .qv-title {
          font-size: 1.8rem;
          margin-bottom: 4px;
        }
        .qv-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .qv-price {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qv-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .qv-variants {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
        }
        .variant-select {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .variant-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          width: 60px;
        }
        .variant-options {
          display: flex;
          gap: 8px;
        }
        .variant-opt {
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.8rem;
          background-color: var(--bg-primary);
          transition: var(--transition-fast);
        }
        .size-opt {
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }
        .size-opt.active {
          background-color: var(--accent-color);
          color: var(--accent-text);
          border-color: var(--accent-color);
        }
        .color-opt {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
        }
        .color-opt.active {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
        }
        .color-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .qv-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
        .qv-cart-btn {
          flex: 1;
        }
      `}</style>
    </>
  );
};
