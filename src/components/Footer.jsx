import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer-section">
      <div className="container">
        {/* Newsletter Banner Grid */}
        <div className="newsletter-grid">
          <div className="newsletter-text">
            <h3>Join our newsletter</h3>
            <p>Subscribe to receive updates on collections, designer collabs, and exclusive offers.</p>
          </div>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            {subscribed ? (
              <div className="subscribe-success animate-fade-in">
                Thank you! You've been subscribed successfully.
              </div>
            ) : (
              <div className="input-group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Links Grid */}
        <div className="footer-links-grid">
          {/* Brand Col */}
          <div className="footer-col col-brand">
            <Link to="/" className="footer-logo">
              AURA <span>WEAR</span>
            </Link>
            <p className="brand-desc">
              Premium clothing made minimally, responsibly, and with absolute dedication to premium fabric quality.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="footer-col">
            <h4>Collections</h4>
            <ul className="footer-list">
              <li><Link to="/shop?category=Men">Men's Collection</Link></li>
              <li><Link to="/shop?category=Women">Women's Collection</Link></li>
              <li><Link to="/shop?category=Kids">Kids Collection</Link></li>
              <li><Link to="/shop?occasion=Summer Collection">Summer Wear</Link></li>
              <li><Link to="/shop?occasion=Formal">Formal Styles</Link></li>
            </ul>
          </div>

          {/* Support Col */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul className="footer-list">
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/shipping-policy">Shipping Policy</Link></li>
              <li><Link to="/return-policy">Returns & Refunds</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="footer-col">
            <h4>Store Info</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>102 Elegance Avenue, Jubilee Hills, Hyderabad, India</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <span>+91 40 4829 1928</span>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <span>hello@aurawear.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Aura Wear. All rights reserved.</p>
          <div className="bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          padding: 80px 0 30px;
          margin-top: auto;
        }
        .newsletter-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 40px;
          padding-bottom: 60px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 60px;
        }
        @media (max-width: 768px) {
          .newsletter-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            padding-bottom: 40px;
            margin-bottom: 40px;
          }
        }
        .newsletter-text h3 {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .newsletter-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .newsletter-form {
          position: relative;
        }
        .subscribe-success {
          background-color: var(--accent-light);
          color: var(--accent-color);
          padding: 14px 20px;
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.9rem;
          border: 1px solid var(--accent-color);
        }
        .input-group {
          display: flex;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          padding: 4px;
          transition: var(--transition-fast);
        }
        .input-group:focus-within {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 2px var(--accent-light);
        }
        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 0.9rem;
        }
        .newsletter-btn {
          background-color: var(--accent-color);
          color: var(--accent-text);
          width: 46px;
          height: 46px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }
        .newsletter-btn:hover {
          background-color: var(--accent-hover);
        }
        .footer-links-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          padding-bottom: 60px;
          border-bottom: 1px solid var(--border-color);
        }
        @media (max-width: 992px) {
          .footer-links-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 576px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
        .footer-logo {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.5rem;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 16px;
          display: inline-block;
        }
        .footer-logo span {
          color: var(--accent-color);
          font-weight: 300;
        }
        .brand-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .social-links {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        .social-icon:hover {
          border-color: var(--text-primary);
          color: var(--text-primary);
          background-color: var(--bg-primary);
          transform: translateY(-2px);
        }
        .footer-col h4 {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
        }
        .footer-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-list a {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .footer-list a:hover {
          color: var(--accent-color);
          padding-left: 4px;
        }
        .contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .contact-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 576px) {
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        .bottom-links {
          display: flex;
          gap: 20px;
        }
        .bottom-links a:hover {
          color: var(--text-primary);
        }
      `}</style>
    </footer>
  );
};
