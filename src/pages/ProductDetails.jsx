import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { useDocumentSEO } from '../hooks/useDocumentSEO';
import { 
  Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, 
  Star, Play, Check, ChevronRight, MessageSquare 
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    products, addToCart, wishlist, toggleWishlist, 
    addToRecentlyViewed, recentlyViewed 
  } = useShop();

  const [product, setProduct] = useState(null);
  
  useDocumentSEO({
    title: product ? `Buy ${product.name} | Contemporary Minimalist` : 'Loading Product...',
    description: product ? `${product.name} - ${product.description.slice(0, 150)}... Buy premium fashion at Aura Wear.` : 'Curated luxury products catalog.',
    keywords: product ? `${product.name.toLowerCase()}, buy ${product.name.toLowerCase()}, aura wear ${product.category.toLowerCase()}, minimalist apparel` : 'minimalist clothes'
  });
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [bundleProducts, setBundleProducts] = useState([]);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomBg, setZoomBg] = useState('');

  // Find product by URL id
  useEffect(() => {
    const p = products.find(prod => prod.id === id);
    if (p) {
      setProduct(p);
      setActiveImageIdx(0);
      setSelectedSize(p.sizes[0] || 'M');
      setSelectedColor(p.colors[0] || 'Black');
      setQuantity(1);
      setIsVideoPlaying(false);
      addToRecentlyViewed(p.id);

      // Frequently Bought Together: Select 2 other random products
      const filteredOthers = products.filter(item => item.id !== p.id);
      const shuffled = [...filteredOthers].sort(() => 0.5 - Math.random());
      setBundleProducts(shuffled.slice(0, 2));
    } else {
      navigate('/404');
    }
  }, [id, products, navigate]);

  if (!product) return <div className="container section-padding text-center">Loading product...</div>;

  const isWishlisted = wishlist.includes(product.id);

  // Custom Zoom Logic on Hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - window.scrollX - left) / width) * 100;
    const y = ((e.pageY - window.scrollY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
    setZoomBg(product.images[activeImageIdx]);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Add to cart click handler
  const handleAddToCart = () => {
    addToCart(product.id, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Buy Now click handler (adds to cart and redirects straight to checkout)
  const handleBuyNow = () => {
    addToCart(product.id, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  // Bundle Add to Cart (adds core product + bundle products in one go)
  const handleAddBundle = () => {
    addToCart(product.id, selectedSize, selectedColor, 1);
    bundleProducts.forEach(p => {
      addToCart(p.id, p.sizes[0] || 'M', p.colors[0] || 'Black', 1);
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Related products logic (shares same category/occasion)
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory))
    .slice(0, 4);

  // Delivery check logic
  const checkDelivery = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && !isNaN(pincode)) {
      const days = pincode.startsWith('5') ? 2 : 5;
      const delivery = new Date();
      delivery.setDate(delivery.getDate() + days);
      setDeliveryDate(`Guaranteed delivery by ${delivery.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}`);
    } else {
      setDeliveryDate('Please enter a valid 6-digit Pincode');
    }
  };

  // Review Summary Math
  const ratingBreakdown = {
    5: product.reviews.filter(r => r.rating === 5).length,
    4: product.reviews.filter(r => r.rating === 4).length,
    3: product.reviews.filter(r => r.rating === 3).length,
    2: product.reviews.filter(r => r.rating === 2).length,
    1: product.reviews.filter(r => r.rating === 1).length,
  };

  const getPercent = (stars) => {
    if (product.reviews.length === 0) return 0;
    return Math.round((ratingBreakdown[stars] / product.reviews.length) * 100);
  };

  // Bundle math
  const bundleTotal = product.price + bundleProducts.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountTotal = Math.round(bundleTotal * 0.9); // 10% bundle deal

  return (
    <div className="product-details-wrapper section-padding">
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link to="/">Home</Link> <ChevronRight size={12} />
          <Link to="/shop">Shop</Link> <ChevronRight size={12} />
          <Link to={`/shop?category=${product.category}`}>{product.category}</Link> <ChevronRight size={12} />
          <span>{product.name}</span>
        </div>

        {/* Core Info Grid */}
        <div className="details-grid">
          {/* Visual Gallery Panel */}
          <div className="gallery-panel">
            <div className="gallery-main">
              {isVideoPlaying && product.videoUrl ? (
                <div className="video-container">
                  <video src={product.videoUrl} controls autoPlay className="main-video"></video>
                  <button onClick={() => setIsVideoPlaying(false)} className="close-video-btn">Close Video</button>
                </div>
              ) : (
                <div 
                  className="main-img-wrapper"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={product.images[activeImageIdx]} alt={product.name} className="main-img" />
                  <div 
                    className="zoom-lens-window" 
                    style={{ 
                      ...zoomStyle, 
                      backgroundImage: `url(${zoomBg})`
                    }}
                  ></div>
                </div>
              )}

              {/* Video Play Trigger Overlay */}
              {product.videoUrl && !isVideoPlaying && (
                <button onClick={() => setIsVideoPlaying(true)} className="play-video-badge">
                  <Play size={16} fill="white" /> View Video
                </button>
              )}
            </div>
            <div className="gallery-thumbs">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => { setActiveImageIdx(idx); setIsVideoPlaying(false); }}
                  className={`thumb-btn ${activeImageIdx === idx ? 'active' : ''}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="details-info-panel">
            <span className="qv-category">{product.category}'s {product.subCategory}</span>
            <h1 className="details-title">{product.name}</h1>

            {/* Ratings */}
            <div className="details-rating-row">
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
              <span className="rating-text">{product.rating} ({product.reviewsCount} verified reviews)</span>
            </div>

            {/* Pricing */}
            <div className="details-price-row">
              <span className="details-price">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="details-orig-price">₹{product.originalPrice}</span>
                  <span className="badge badge-discount">{product.discountBadge}</span>
                </>
              )}
            </div>

            <div className="divider"></div>

            <p className="details-desc">{product.description}</p>

            {/* Variants Selector */}
            <div className="details-variants">
              <div className="variant-select">
                <span className="variant-label">Select Size:</span>
                <div className="variant-options">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`size-square-opt ${selectedSize === size ? 'active' : ''}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="variant-select">
                <span className="variant-label">Select Color:</span>
                <div className="variant-options">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`color-btn-opt ${selectedColor === color ? 'active' : ''}`}
                    >
                      <span className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="variant-select">
                <span className="variant-label">Quantity:</span>
                <div className="qty-picker">
                  <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="qty-btn">-</button>
                  <span className="qty-val">{quantity}</span>
                  <button onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))} className="qty-btn">+</button>
                </div>
                <span className="stock-notice text-muted">({product.stock} units available)</span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="details-actions">
              <button 
                onClick={handleAddToCart} 
                className={`btn btn-primary cart-cta-btn ${isAdded ? 'success' : ''}`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
              <button onClick={handleBuyNow} className="btn btn-secondary buy-cta-btn">Buy It Now</button>
              <button 
                onClick={() => toggleWishlist(product.id)} 
                className={`btn-icon wishlist-cta-btn ${isWishlisted ? 'active' : ''}`}
                aria-label="Add to Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? "var(--accent-color)" : "none"} />
              </button>
            </div>

            {/* Pincode checker */}
            <div className="pincode-checker-box">
              <h4>Check Delivery Estimate</h4>
              <form onSubmit={checkDelivery} className="pincode-form">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="form-input pincode-input"
                />
                <button type="submit" className="btn btn-outline btn-sm">Check</button>
              </form>
              {deliveryDate && <p className="delivery-status-msg">{deliveryDate}</p>}
            </div>

            {/* Core Trust Badges */}
            <div className="detail-trust-points">
              <div className="trust-point">
                <Truck size={18} />
                <span>Quick Dispatch: Dispatched in 24 Hours</span>
              </div>
              <div className="trust-point">
                <RotateCcw size={18} />
                <span>Return Support: 14-Day Exchanges Available</span>
              </div>
              <div className="trust-point">
                <ShieldCheck size={18} />
                <span>Genuine Quality: 100% Certified Fabrics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab panels */}
        <section className="section-padding details-tabs-section">
          <div className="tabs-header">
            <button onClick={() => setActiveTab('specs')} className={`tab-title-btn ${activeTab === 'specs' ? 'active' : ''}`}>Specifications</button>
            <button onClick={() => setActiveTab('reviews')} className={`tab-title-btn ${activeTab === 'reviews' ? 'active' : ''}`}>Reviews ({product.reviews.length})</button>
            <button onClick={() => setActiveTab('returns')} className={`tab-title-btn ${activeTab === 'returns' ? 'active' : ''}`}>Shipping & Returns</button>
          </div>

          <div className="tab-body-box">
            {activeTab === 'specs' && (
              <div className="tab-content-panel animate-fade-in">
                <ul className="features-bullet-list">
                  {product.features.map((feat, idx) => (
                    <li key={idx}><Check size={16} className="bullet-icon" /> {feat}</li>
                  ))}
                  <li><Check size={16} className="bullet-icon" /> Fit styling type: {product.fit || 'Regular Fit'}</li>
                  <li><Check size={16} className="bullet-icon" /> Fabric Category: Organic Combed Blends</li>
                  <li><Check size={16} className="bullet-icon" /> Care instructions: Cold machine wash inside out</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content-panel reviews-tab-grid animate-fade-in">
                <div className="ratings-breakdown-panel">
                  <div className="overall-score-card">
                    <h2>{product.rating}</h2>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "#ffc107" : "none"} stroke={i < Math.floor(product.rating) ? "#ffc107" : "var(--text-muted)"} />
                      ))}
                    </div>
                    <span>{product.reviewsCount} Customer Reviews</span>
                  </div>

                  <div className="stars-progress-list">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="star-progress-row">
                        <span>{stars} ★</span>
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${getPercent(stars)}%` }}></div>
                        </div>
                        <span className="percent-label">{getPercent(stars)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="reviews-list-panel">
                  {product.reviews.length === 0 ? (
                    <div className="no-reviews text-center">
                      <MessageSquare size={32} className="text-muted mb-12" />
                      <p>No reviews written for this product yet.</p>
                    </div>
                  ) : (
                    product.reviews.map(rev => (
                      <div key={rev.id} className="review-comment-card">
                        <div className="rev-header">
                          <strong>{rev.name}</strong>
                          <span className="rev-date">{rev.date}</span>
                        </div>
                        <div className="rev-stars">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={12} fill="#ffc107" stroke="#ffc107" />
                          ))}
                        </div>
                        <p className="rev-comment">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="tab-content-panel info-text-tab animate-fade-in">
                <h4>Shipping Delivery Details</h4>
                <p>We provide complimentary express delivery inside India for all order totals exceeding ₹1,500. Standard shipping cost is ₹80. Dispatch occurs within 24 business hours from placement. Delivery timeframe is 2-5 business days depending on location.</p>
                
                <h4 className="mt-16">Returns & Exchange Policy</h4>
                <p>Enjoy absolute peace of mind with our 14-day hassle-free exchange window. If size fitting isn't correct or you receive a damaged product, initiate a reverse pickup from your Dashboard orders list. T&C apply (garments must remain unworn, tag attached).</p>
              </div>
            )}
          </div>
        </section>

        {/* Frequently Bought Together Widget */}
        {bundleProducts.length > 0 && (
          <section className="section-padding bundle-section">
            <div className="bundle-box">
              <h3>Frequently Bought Together</h3>
              <p className="text-secondary">Save 10% when you buy these styling pieces together.</p>
              
              <div className="bundle-items-row">
                {/* Core item */}
                <div className="bundle-item-card">
                  <img src={product.images[0]} alt="" />
                  <span className="bundle-item-name">{product.name}</span>
                  <span className="bundle-item-price">₹{product.price}</span>
                </div>

                <div className="bundle-plus-sign">+</div>

                {/* Bundle Item 1 */}
                <div className="bundle-item-card">
                  <img src={bundleProducts[0].images[0]} alt="" />
                  <span className="bundle-item-name">{bundleProducts[0].name}</span>
                  <span className="bundle-item-price">₹{bundleProducts[0].price}</span>
                </div>

                <div className="bundle-plus-sign">+</div>

                {/* Bundle Item 2 */}
                <div className="bundle-item-card">
                  <img src={bundleProducts[1].images[0]} alt="" />
                  <span className="bundle-item-name">{bundleProducts[1].name}</span>
                  <span className="bundle-item-price">₹{bundleProducts[1].price}</span>
                </div>

                <div className="bundle-summary-box">
                  <div className="bundle-pricing">
                    <span className="bundle-orig-price text-muted">Total: ₹{bundleTotal}</span>
                    <span className="bundle-discounted-price">Bundle: ₹{bundleDiscountTotal}</span>
                    <span className="badge badge-discount">Save 10%</span>
                  </div>
                  <button onClick={handleAddBundle} className="btn btn-primary btn-sm bundle-add-btn">
                    Add All 3 Items to Cart
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <section className="section-padding related-section">
            <h2>You May Also Like</h2>
            <p className="text-secondary mb-24">Handpicked matching combinations for your wardrobe styling.</p>
            <div className="products-grid-home">
              {relatedProducts.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add-to-Cart Panel */}
      <div className="sticky-mobile-add">
        <div className="sticky-mobile-details">
          <img src={product.images[0]} alt="" />
          <div>
            <h4>{product.name}</h4>
            <span>₹{product.price}</span>
          </div>
        </div>
        <button onClick={handleAddToCart} className="btn btn-primary btn-sm">
          {isAdded ? 'Added' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .breadcrumbs a:hover {
          color: var(--accent-color);
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
        }
        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
        
        /* Gallery */
        .gallery-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .gallery-main {
          position: relative;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          width: 100%;
        }
        .main-img-wrapper {
          position: relative;
          padding-top: 110%;
          cursor: crosshair;
        }
        .main-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .zoom-lens-window {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-size: 200%;
          pointer-events: none;
          z-index: 10;
        }
        .video-container {
          position: relative;
          padding-top: 110%;
          background-color: #000;
        }
        .main-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .close-video-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(28,24,20,0.8);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          z-index: 5;
        }
        .play-video-badge {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: var(--text-primary);
          color: var(--bg-primary);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: var(--shadow-md);
        }
        .gallery-thumbs {
          display: flex;
          gap: 12px;
        }
        .thumb-btn {
          width: 80px;
          height: 90px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
        }
        .thumb-btn.active {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px var(--accent-light);
        }
        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Details info panel */
        .details-info-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .details-title {
          font-size: 2.2rem;
          line-height: 1.25;
        }
        @media (max-width: 768px) {
          .details-title {
            font-size: 1.8rem;
          }
        }
        .details-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .details-price-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .details-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--accent-color);
        }
        .details-orig-price {
          font-size: 1.1rem;
          text-decoration: line-through;
          color: var(--text-muted);
        }
        .details-desc {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        /* Variants */
        .details-variants {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background-color: var(--bg-secondary);
          padding: 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .color-btn-opt {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
        }
        .color-btn-opt.active {
          border-color: var(--accent-color);
          background-color: var(--accent-light);
        }
        .qty-picker {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background-color: var(--bg-primary);
          overflow: hidden;
          width: 110px;
        }
        .qty-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          background-color: var(--bg-secondary);
        }
        .qty-val {
          flex: 1;
          text-align: center;
          font-weight: 600;
        }
        .stock-notice {
          font-size: 0.8rem;
          margin-left: 8px;
        }

        /* Actions */
        .details-actions {
          display: flex;
          gap: 16px;
          margin-top: 10px;
        }
        .cart-cta-btn {
          flex: 1.5;
        }
        .buy-cta-btn {
          flex: 1;
        }
        .cart-cta-btn.success {
          background-color: #248a52;
        }

        /* Pincode */
        .pincode-checker-box {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px;
        }
        .pincode-checker-box h4 {
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        .pincode-form {
          display: flex;
          gap: 12px;
        }
        .pincode-input {
          max-width: 200px;
        }
        .delivery-status-msg {
          margin-top: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--accent-color);
        }

        /* Trust Points */
        .detail-trust-points {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }
        .trust-point {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .trust-point svg {
          color: var(--accent-color);
        }

        /* Tabs Section */
        .tabs-header {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 24px;
        }
        .tab-title-btn {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          padding: 12px 4px;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
          transition: var(--transition-fast);
        }
        .tab-title-btn:hover {
          color: var(--text-primary);
        }
        .tab-title-btn.active {
          color: var(--text-primary);
          border-bottom-color: var(--text-primary);
        }
        .tab-body-box {
          padding: 10px 0;
        }
        .features-bullet-list {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 576px) {
          .features-bullet-list {
            grid-template-columns: 1fr;
          }
        }
        .features-bullet-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .bullet-icon {
          color: #248a52;
        }
        
        /* Reviews tab */
        .reviews-tab-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
        }
        @media (max-width: 768px) {
          .reviews-tab-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .overall-score-card {
          text-align: center;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
          background-color: var(--bg-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .overall-score-card h2 {
          font-size: 3rem;
          line-height: 1;
        }
        .stars-progress-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .star-progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
        }
        .star-progress-row > span {
          width: 30px;
        }
        .progress-bar-track {
          flex: 1;
          height: 6px;
          background-color: var(--bg-secondary);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: #ffc107;
        }
        .percent-label {
          width: 35px;
          text-align: right;
          color: var(--text-muted);
        }
        .review-comment-card {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .review-comment-card:last-child {
          border-bottom: none;
        }
        .rev-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }
        .rev-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .rev-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 8px;
        }
        .rev-comment {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        /* Bundle Section */
        .bundle-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
        }
        .bundle-items-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 24px;
        }
        .bundle-item-card {
          width: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-align: center;
        }
        .bundle-item-card img {
          width: 100px;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }
        .bundle-item-name {
          font-size: 0.75rem;
          font-weight: 500;
          height: 2.4em;
          overflow: hidden;
          line-height: 1.2;
        }
        .bundle-item-price {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .bundle-plus-sign {
          font-size: 1.5rem;
          font-weight: 300;
          color: var(--text-muted);
        }
        .bundle-summary-box {
          margin-left: auto;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 220px;
        }
        @media (max-width: 768px) {
          .bundle-summary-box {
            margin-left: 0;
            width: 100%;
          }
        }
        .bundle-pricing {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bundle-orig-price {
          font-size: 0.85rem;
          text-decoration: line-through;
        }
        .bundle-discounted-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-color);
        }

        /* Sticky Bottom Mobile Bar */
        .sticky-mobile-add {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: var(--bg-primary);
          border-top: 1px solid var(--border-color);
          box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
          padding: 12px 16px;
          display: none;
          align-items: center;
          justify-content: space-between;
          z-index: 90;
        }
        .sticky-mobile-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sticky-mobile-details img {
          width: 40px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }
        .sticky-mobile-details h4 {
          font-size: 0.85rem;
          font-weight: 600;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sticky-mobile-details span {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-color);
        }
        @media (max-width: 768px) {
          .sticky-mobile-add {
            display: flex;
          }
          .details-actions {
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );
};
