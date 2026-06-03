import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle, ShieldAlert, FileText, Truck, RefreshCw } from 'lucide-react';

export const StaticPolicies = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('faq');

  // Sync tab selector on initial load or route transition
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (['faq', 'privacy-policy', 'terms-conditions', 'shipping-policy', 'return-policy'].includes(path)) {
      setActiveTab(path);
    }
  }, [location]);

  return (
    <div className="policies-page-wrapper section-padding animate-fade-in">
      <div className="container">
        <h1 className="policies-title">Customer Resource Desk</h1>
        
        <div className="policies-layout">
          {/* Tabs Sidebar */}
          <aside className="policies-tabs-aside">
            <button onClick={() => setActiveTab('faq')} className={`policy-tab-item ${activeTab === 'faq' ? 'active' : ''}`}>
              <HelpCircle size={16} /> FAQs
            </button>
            <button onClick={() => setActiveTab('shipping-policy')} className={`policy-tab-item ${activeTab === 'shipping-policy' ? 'active' : ''}`}>
              <Truck size={16} /> Shipping Policy
            </button>
            <button onClick={() => setActiveTab('return-policy')} className={`policy-tab-item ${activeTab === 'return-policy' ? 'active' : ''}`}>
              <RefreshCw size={16} /> Returns & Refunds
            </button>
            <button onClick={() => setActiveTab('privacy-policy')} className={`policy-tab-item ${activeTab === 'privacy-policy' ? 'active' : ''}`}>
              <ShieldAlert size={16} /> Privacy Policy
            </button>
            <button onClick={() => setActiveTab('terms-conditions')} className={`policy-tab-item ${activeTab === 'terms-conditions' ? 'active' : ''}`}>
              <FileText size={16} /> Terms & Conditions
            </button>
          </aside>

          {/* Main Contents Card */}
          <main className="policy-main-content">
            
            {activeTab === 'faq' && (
              <div className="policy-tab-panel animate-fade-in">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list mt-24">
                  <div className="faq-item">
                    <h4>What makes your fabrics "premium"?</h4>
                    <p>All Aura Wear cotton is long-staple organic combed cotton. It is heavier than normal department store cotton (our shirts range between 180-240 GSM, hoodies at 420 GSM), giving it an incredibly structural fit and preventing shrinking in machine wash cycles.</p>
                  </div>
                  <div className="faq-item mt-16">
                    <h4>Do you offer international shipping?</h4>
                    <p>Currently, we ship exclusively inside India. We provide complimentary express transit for all checkout orders exceeding ₹1,500.</p>
                  </div>
                  <div className="faq-item mt-16">
                    <h4>How do I track my delivery?</h4>
                    <p>Once you place an order, you will receive a 10-character reference ID (e.g. ORD-XXXXX-AU). Enter this ID on our dedicated tracking page or check your dashboard orders panel.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping-policy' && (
              <div className="policy-tab-panel animate-fade-in">
                <h2>Shipping & Dispatch Policy</h2>
                <p className="mt-16">We process and dispatch packaging within 24 business hours from placement. Deliveries to metro cities (Delhi, Mumbai, Bengaluru, Hyderabad) usually arrive within 2-3 business days. Remote locations may take up to 5 business days.</p>
                <h4 className="mt-24">Shipping charges:</h4>
                <ul className="policy-bullet-list mt-12">
                  <li>Orders below ₹1,500: Standard courier fee of ₹80.</li>
                  <li>Orders above ₹1,500: Free Express Delivery.</li>
                </ul>
              </div>
            )}

            {activeTab === 'return-policy' && (
              <div className="policy-tab-panel animate-fade-in">
                <h2>Returns & Refund Policy</h2>
                <p className="mt-16">We offer a 14-day hassle-free exchange and return window. If sizing doesn't fit, simply log into your Dashboard, locate the order reference, and select 'Request Exchange'. We will dispatch a courier to pick up the item at no cost to you.</p>
                <h4 className="mt-24">Return Conditions:</h4>
                <ul className="policy-bullet-list mt-12">
                  <li>Items must be unworn, unwashed, and undamaged.</li>
                  <li>Original fabric security tags must remain attached.</li>
                  <li>Innerwear garments are exempt from returns due to hygiene reasons.</li>
                </ul>
              </div>
            )}

            {activeTab === 'privacy-policy' && (
              <div className="policy-tab-panel animate-fade-in">
                <h2>Privacy Protection Policy</h2>
                <p className="mt-16">Your private database profiles are encrypted. We never share customer contact details or billing records with marketing brokers. Payment checkouts are fully processed via SSL-secured payment gateway tokens.</p>
              </div>
            )}

            {activeTab === 'terms-conditions' && (
              <div className="policy-tab-panel animate-fade-in">
                <h2>Terms & Conditions of Service</h2>
                <p className="mt-16">By browsing Aura Wear catalog, placing orders, or registering credentials, you agree to comply with our fair-use customer guidelines. We reserve the right to cancel orders with suspected fraudulent billing records.</p>
              </div>
            )}
            
          </main>
        </div>
      </div>

      <style>{`
        .policies-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .policies-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }
        @media (max-width: 768px) {
          .policies-layout {
            grid-template-columns: 1fr;
          }
        }
        .policies-tabs-aside {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .policy-tab-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          text-align: left;
          font-weight: 500;
          transition: var(--transition-fast);
        }
        .policy-tab-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .policy-tab-item.active {
          background-color: var(--accent-color);
          color: var(--accent-text);
        }
        
        .policy-main-content {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-primary);
          padding: 40px;
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 576px) {
          .policy-main-content {
            padding: 24px;
          }
        }
        
        .policy-tab-panel h2 {
          font-size: 1.6rem;
        }
        .policy-tab-panel h4 {
          font-size: 1.05rem;
          font-weight: 600;
        }
        .policy-tab-panel p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .policy-bullet-list {
          list-style: disc;
          padding-left: 20px;
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .mt-24 { margin-top: 24px; }
        .mt-16 { margin-top: 16px; }
        .mt-12 { margin-top: 12px; }
      `}</style>
    </div>
  );
};
