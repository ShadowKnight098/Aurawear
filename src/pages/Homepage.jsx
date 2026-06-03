import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Truck, ArrowRight, ShieldCheck, RefreshCw, Headset, 
  Star, Timer, Sparkles, ChevronLeft, ChevronRight 
} from 'lucide-react';

export const Homepage = () => {
  const { products } = useShop();
  const navigate = useNavigate();

  // Flash Sale Countdown timer (ticks down every second)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 34, seconds: 12 });
  useEffect(() => {
    const totalSecs =timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
    if (totalSecs <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const currentTotal = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (currentTotal <= 0) {
          clearInterval(interval);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        return {
          hours: Math.floor(currentTotal / 3600),
          minutes: Math.floor((currentTotal % 3600) / 60),
          seconds: currentTotal % 60
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  // Filter products for showcases
  const bestSellers = products.filter(p => p.discountBadge === 'Best Seller' || p.rating >= 4.7).slice(0, 4);
  const newArrivals = products.filter(p => p.id.includes('-3') || p.id.includes('-5')).slice(0, 4);
  const trending = products.filter(p => p.discountBadge === 'Trending' || p.reviewsCount > 90).slice(0, 4);

  // Categories list
  const categories = [
    { name: 'Men', label: 'Men', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80', count: '12 Items' },
    { name: 'Women', label: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80', count: '15 Items' },
    { name: 'Kids', label: 'Kids', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=600&auto=format&fit=crop&q=80', count: '8 Items' }
  ];

  // Occasions list
  const occasions = [
    { name: 'Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80' },
    { name: 'Formal', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80' },
    { name: 'Party Wear', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80' },
    { name: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80' },
    { name: 'Office Wear', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&auto=format&fit=crop&q=80' },
    { name: 'Summer Collection', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&auto=format&fit=crop&q=80' }
  ];

  // Testimonials Carousel
  const reviews = [
    {
      id: 1,
      name: "Sophia L.",
      rating: 5,
      role: "Verified Buyer",
      comment: "Aura Wear completely redefined my expectations for online clothing quality. The linen shirt I bought is so soft and thick, fits perfectly, and the off-white color is gorgeous. Absolute customer for life!",
      product: "Classic Linen Kurtis"
    },
    {
      id: 2,
      name: "Kabir S.",
      rating: 5,
      role: "Stylist",
      comment: "Minimalist fashion at its best. No heavy logos or flashy patterns, just pure fabric excellence. The leather biker jacket is thick, soft, and feels like it cost triple the price.",
      product: "Classic Leather Biker Jacket"
    },
    {
      id: 3,
      name: "Elena R.",
      rating: 5,
      role: "Fashion Blogger",
      comment: "Customer support is top notch, and delivery was incredibly fast. I also love the dark mode on their website—so pleasant for late-night shopping. The dress has beautiful stitching.",
      product: "Elegant Evening Midi Dress"
    }
  ];

  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  return (
    <div className="homepage-wrapper">
      {/* Flash Sale Banner */}
      <div className="flash-banner">
        <div className="container flash-banner-content">
          <div className="flash-deal">
            <Timer size={16} />
            <strong>FLASH SALE:</strong> Up to 35% off selected outerwear
          </div>
          <div className="flash-timer">
            Ends in: <span>{formatTime(timeLeft.hours)}</span>h : <span>{formatTime(timeLeft.minutes)}</span>m : <span>{formatTime(timeLeft.seconds)}</span>s
          </div>
          <div className="flash-coupon">
            Use code <strong>SUMMER10</strong> for extra 10% off!
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content animate-fade-in">
            <span className="hero-subtitle">NEW ARRIVALS 2026</span>
            <h1 className="hero-title">Minimalism Meets Premium Comfort</h1>
            <p className="hero-description">
              Carefully designed essentials made from premium long-staple organic cotton, breathable fine linen, and heritage full-grain leather. Built to last, styled to remain timeless.
            </p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn btn-primary">Shop The Collection <ArrowRight size={18} /></Link>
              <Link to="/about" className="btn btn-secondary">Our Story</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon-box"><Truck size={24} /></div>
            <div className="trust-info">
              <h4>Free Express Delivery</h4>
              <p>On all orders above ₹1,500</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><ShieldCheck size={24} /></div>
            <div className="trust-info">
              <h4>Secure Payments</h4>
              <p>Fully SSL-encrypted checkout gateway</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><RefreshCw size={24} /></div>
            <div className="trust-info">
              <h4>Easy 14-Day Returns</h4>
              <p>Hassle-free sizing exchanges</p>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon-box"><Headset size={24} /></div>
            <div className="trust-info">
              <h4>24/7 Dedicated Support</h4>
              <p>Direct live chat and email support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section-padding category-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Shop by Category</h2>
            <p className="text-secondary">Explore our tailored clothing ranges for Men, Women, and Kids.</p>
          </div>
          
          <div className="category-grid">
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                className="category-card"
                onClick={() => navigate(`/shop?category=${cat.name}`)}
              >
                <div className="category-image-wrapper">
                  <img src={cat.image} alt={cat.name} className="category-img" />
                </div>
                <div className="category-info">
                  <h3>{cat.label}</h3>
                  <span>{cat.count}</span>
                </div>
                <div className="category-arrow">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Occasion */}
      <section className="section-padding occasion-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline">SHOP BY OCCASION</span>
            <h2>Tailored for Every Moment</h2>
            <p className="text-secondary">People often shop for events. Find the perfect look for your next outing.</p>
          </div>

          <div className="occasion-grid">
            {occasions.map((occ) => (
              <div 
                key={occ.name} 
                className="occasion-card"
                onClick={() => navigate(`/shop?occasion=${occ.name}`)}
              >
                <img src={occ.image} alt={occ.name} className="occasion-img" />
                <div className="occasion-card-title">
                  <span>{occ.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-padding bg-secondary-wrap">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2>Best Sellers</h2>
              <p className="text-secondary">Our most loved and highly-rated premium essentials.</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">View All Products</Link>
          </div>

          <div className="products-grid-home">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2>New Arrivals</h2>
              <p className="text-secondary">Fresh off the loom. Update your capsule wardrobe.</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">View All Products</Link>
          </div>

          <div className="products-grid-home">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending This Week Section */}
      <section className="section-padding bg-secondary-wrap">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2>Trending This Week</h2>
              <p className="text-secondary">What our community is wearing right now.</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">View All Products</Link>
          </div>

          <div className="products-grid-home">
            {trending.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2>Shared Experiences</h2>
            <p className="text-secondary">Hear from our community about product quality and fit sizing.</p>
          </div>

          <div className="testimonial-carousel-box">
            <div className="testimonial-card animate-scale-in">
              <div className="stars-row">
                {[...Array(reviews[activeReviewIdx].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#ffc107" stroke="#ffc107" />
                ))}
              </div>
              <p className="testimonial-comment">"{reviews[activeReviewIdx].comment}"</p>
              <div className="testimonial-author">
                <strong>{reviews[activeReviewIdx].name}</strong>
                <span className="author-role">{reviews[activeReviewIdx].role}</span>
                <span className="author-prod">Purchased: {reviews[activeReviewIdx].product}</span>
              </div>
            </div>

            <div className="carousel-controls">
              <button 
                onClick={() => setActiveReviewIdx(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
                className="btn-icon btn-sm"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="carousel-indicator">
                {activeReviewIdx + 1} / {reviews.length}
              </span>
              <button 
                onClick={() => setActiveReviewIdx(prev => prev === reviews.length - 1 ? 0 : prev + 1)}
                className="btn-icon btn-sm"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .flash-banner {
          background-color: var(--text-primary);
          color: var(--bg-primary);
          font-size: 0.85rem;
          padding: 10px 0;
          border-bottom: 1px solid var(--border-color);
        }
        .flash-banner-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        @media (max-width: 768px) {
          .flash-banner-content {
            flex-direction: column;
            text-align: center;
          }
        }
        .flash-deal {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .flash-timer span {
          background-color: var(--bg-primary);
          color: var(--text-primary);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 700;
          margin: 0 2px;
        }
        
        /* Hero section styling */
        .hero-section {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80');
          background-size: cover;
          background-position: center;
          height: calc(100vh - var(--nav-height) - 40px);
          min-height: 550px;
          display: flex;
          align-items: center;
        }
        .hero-bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(28, 26, 23, 0.75) 0%, rgba(28, 26, 23, 0.2) 100%);
        }
        [data-theme="dark"] .hero-bg-overlay {
          background: linear-gradient(90deg, rgba(18, 18, 17, 0.85) 0%, rgba(18, 18, 17, 0.4) 100%);
        }
        .hero-container {
          position: relative;
          z-index: 5;
        }
        .hero-content {
          max-width: 600px;
          color: #ffffff;
        }
        .hero-subtitle {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: var(--accent-color);
          display: block;
          margin-bottom: 16px;
        }
        .hero-title {
          font-size: 3.2rem;
          line-height: 1.15;
          margin-bottom: 20px;
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
        }
        .hero-description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 32px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
        }
        @media (max-width: 480px) {
          .hero-ctas {
            flex-direction: column;
          }
        }
        .hero-ctas .btn-secondary {
          background-color: transparent;
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }
        .hero-ctas .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
          border-color: #ffffff;
        }

        /* Trust section */
        .trust-section {
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          padding: 32px 0;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 992px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .trust-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .trust-icon-box {
          color: var(--accent-color);
          background-color: var(--bg-primary);
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .trust-info h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .trust-info p {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Section headers */
        .section-header {
          max-width: 600px;
          margin: 0 auto 48px;
        }
        .section-header h2 {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .section-tagline {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-color);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }
        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
        }
        .section-header-row h2 {
          font-size: 2rem;
          margin-bottom: 6px;
        }

        /* Category layouts */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .category-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
        .category-card {
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 40px;
          padding: 10px 20px 10px 10px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
          position: relative;
        }
        .category-card:hover {
          transform: translateY(-2px);
          border-color: var(--accent-color);
          box-shadow: var(--shadow-md);
          background: var(--bg-primary);
        }
        .category-image-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16px;
          border: 2px solid var(--border-color);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .category-card:hover .category-image-wrapper {
          border-color: var(--accent-color);
          transform: rotate(5deg);
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .category-card:hover .category-img {
          transform: scale(1.15);
        }
        .category-info {
          flex-grow: 1;
        }
        .category-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .category-info span {
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: block;
          margin-top: 2px;
        }
        .category-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        .category-card:hover .category-arrow {
          background: var(--accent-color);
          color: #ffffff;
          border-color: var(--accent-color);
          transform: translateX(4px);
        }

        /* Occasions grid */
        .occasion-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        @media (max-width: 992px) {
          .occasion-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 576px) {
          .occasion-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .occasion-card {
          position: relative;
          height: 150px;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--border-color);
          transition: var(--transition-normal);
        }
        .occasion-card:hover {
          transform: scale(1.03);
          box-shadow: var(--shadow-md);
        }
        .occasion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7);
          transition: transform 0.6s;
        }
        .occasion-card:hover .occasion-img {
          transform: scale(1.08);
          filter: brightness(0.65);
        }
        .occasion-card-title {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          text-align: center;
          padding: 8px;
          font-family: var(--font-display);
        }

        /* Wrap backgrounds */
        .bg-secondary-wrap {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        /* Products Grid */
        .products-grid-home {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 992px) {
          .products-grid-home {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .products-grid-home {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        /* Testimonials Carousel */
        .testimonial-carousel-box {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          max-width: 800px;
          margin: 0 auto;
          padding: 48px;
          box-shadow: var(--shadow-sm);
          text-align: center;
        }
        @media (max-width: 576px) {
          .testimonial-carousel-box {
            padding: 24px;
          }
        }
        .stars-row {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: 24px;
        }
        .testimonial-comment {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--text-primary);
          margin-bottom: 28px;
          font-style: italic;
        }
        @media (max-width: 576px) {
          .testimonial-comment {
            font-size: 1.05rem;
          }
        }
        .testimonial-author {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .author-role {
          font-size: 0.8rem;
          color: var(--accent-color);
          font-weight: 600;
        }
        .author-prod {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 32px;
        }
        .carousel-indicator {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
};
