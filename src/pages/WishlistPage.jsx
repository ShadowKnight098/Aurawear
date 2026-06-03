import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingBag, Eye } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage = () => {
  const { wishlist, products, toggleWishlist, addToCart } = useShop();

  const wishlistedItems = products.filter(p => wishlist.includes(p.id));
  const recommendedItems = products.filter(p => !wishlist.includes(p.id)).slice(0, 4);

  const handleMoveToCart = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const defaultSize = prod.sizes[0] || 'M';
    const defaultColor = prod.colors[0] || 'Black';
    
    addToCart(productId, defaultSize, defaultColor, 1);
    toggleWishlist(productId); // Remove from wishlist on transfer
  };

  return (
    <div className="wishlist-page-wrapper section-padding">
      <div className="container">
        <h1 className="wishlist-title">My Wishlist</h1>

        {wishlistedItems.length === 0 ? (
          <div className="empty-wishlist text-center animate-scale-in">
            <Heart size={48} className="text-muted" />
            <h2>Your wishlist is empty</h2>
            <p>Save items you love here to easily purchase them later.</p>
            <Link to="/shop" className="btn btn-primary">Browse Catalog</Link>
          </div>
        ) : (
          <div className="wishlist-grid animate-fade-in">
            {wishlistedItems.map(item => (
              <div key={item.id} className="wishlist-item-card">
                <div className="wishlist-img-box">
                  <img src={item.images[0]} alt={item.name} />
                  <button 
                    onClick={() => toggleWishlist(item.id)} 
                    className="wishlist-remove-btn"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="wishlist-item-info">
                  <span className="item-cat">{item.category} | {item.subCategory}</span>
                  <Link to={`/product/${item.id}`} className="item-name-link">
                    <h3>{item.name}</h3>
                  </Link>
                  <span className="item-price">₹{item.price}</span>
                  <div className="wishlist-card-actions">
                    <button 
                      onClick={() => handleMoveToCart(item.id)} 
                      className="btn btn-primary btn-sm flex-1"
                    >
                      <ShoppingBag size={14} /> Move to Cart
                    </button>
                    <Link to={`/product/${item.id}`} className="btn btn-secondary btn-sm" title="View details">
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Recommendations */}
        <section className="section-padding recommended-section border-top-divider">
          <h2>Trending Styles For You</h2>
          <p className="text-secondary mb-24">We think you might like these newly arrived premium designs.</p>
          <div className="products-grid-home">
            {recommendedItems.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .wishlist-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .empty-wishlist {
          padding: 80px 40px;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .empty-wishlist p {
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        /* Grid layout */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        @media (max-width: 576px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        .wishlist-item-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: var(--bg-primary);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .wishlist-img-box {
          position: relative;
          padding-top: 115%;
          background-color: var(--bg-secondary);
        }
        .wishlist-img-box img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .wishlist-remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: var(--transition-fast);
          z-index: 5;
        }
        .wishlist-remove-btn:hover {
          color: #c93b3b;
          border-color: #c93b3b;
          transform: scale(1.05);
        }
        
        .wishlist-item-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 8px;
        }
        .item-cat {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .wishlist-item-info h3 {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.35;
          height: 2.7em;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .item-price {
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--accent-color);
        }
        .wishlist-card-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .flex-1 {
          flex: 1;
        }
        
        .border-top-divider {
          border-top: 1px solid var(--border-color);
          margin-top: 60px;
        }
      `}</style>
    </div>
  );
};
