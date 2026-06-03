import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && msg.trim()) {
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMsg('');
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <div className="contact-page-wrapper section-padding animate-fade-in">
      <div className="container">
        
        {/* Title */}
        <section className="contact-hero text-center mb-48">
          <span className="section-tagline">GET IN TOUCH</span>
          <h1>We'd love to hear from you</h1>
          <p className="text-secondary max-w-600">
            Have questions about fabric weights, custom orders, sizing fits, or shipping transit times? Write to us.
          </p>
        </section>

        <div className="contact-grid">
          {/* Form Box */}
          <div className="contact-form-card">
            <h3>Send us a Message</h3>
            
            {isSuccess ? (
              <div className="submit-success-box animate-scale-in">
                <Check size={24} className="success-icon" />
                <h4>Message Sent Successfully</h4>
                <p>Thank you for reaching out. A wardrobe specialist will get back to you within 12 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Sharma" 
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">How can we help?</label>
                  <textarea 
                    rows="5" 
                    required 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type details about your query..." 
                    className="form-input form-textarea" 
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info Details & Vector Map Column */}
          <div className="contact-info-col">
            <div className="info-details-box mb-24">
              <h3>Atelier Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <MapPin size={20} className="info-icon" />
                  <div>
                    <h4>Atelier Location</h4>
                    <p>102 Elegance Avenue, Jubilee Hills, Hyderabad, India</p>
                  </div>
                </div>

                <div className="info-item">
                  <Phone size={20} className="info-icon" />
                  <div>
                    <h4>Phone Line</h4>
                    <p>+91 40 4829 1928</p>
                  </div>
                </div>

                <div className="info-item">
                  <Mail size={20} className="info-icon" />
                  <div>
                    <h4>General Inquiries</h4>
                    <p>hello@aurawear.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Premium Styled Vector Map */}
            <div className="mock-map-widget">
              <div className="map-overlay">
                <div className="map-pin-pulse">
                  <div className="pulse-ring"></div>
                  <div className="pulse-dot"></div>
                </div>
                <div className="map-label-card">
                  <strong>AURA WEAR ATELIER</strong>
                  <span>Jubilee Hills, Hyderabad</span>
                </div>
              </div>
              {/* Abstract grid lines simulating mapping structure */}
              <div className="map-grid-lines">
                {[...Array(6)].map((_, i) => <div key={i} className="grid-line line-h" style={{ top: `${i * 20}%` }}></div>)}
                {[...Array(6)].map((_, i) => <div key={i} className="grid-line line-v" style={{ left: `${i * 20}%` }}></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .max-w-600 {
          max-width: 600px;
          margin: 12px auto 0;
        }
        .mb-48 {
          margin-bottom: 48px;
        }
        .mb-24 {
          margin-bottom: 24px;
        }
        .contact-hero {
          margin-top: 40px;
        }
        .contact-hero h1 {
          font-size: 2.5rem;
          margin-top: 6px;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        
        .contact-form-card {
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }
        .contact-form-card h3 {
          font-size: 1.25rem;
          margin-bottom: 24px;
        }
        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }
        
        .submit-success-box {
          text-align: center;
          padding: 40px 20px;
          background-color: var(--bg-primary);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
        }
        .submit-success-box .success-icon {
          color: #248a52;
          margin-bottom: 12px;
        }
        .submit-success-box h4 {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .submit-success-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        
        /* Info details */
        .info-details-box {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          background-color: var(--bg-primary);
        }
        .info-details-box h3 {
          font-size: 1.25rem;
          margin-bottom: 20px;
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .info-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .info-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .info-item h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .info-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        
        /* Vector Map Widget */
        .mock-map-widget {
          height: 240px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          position: relative;
          overflow: hidden;
        }
        .map-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
          z-index: 10;
        }
        
        /* Map pulse keyframe */
        .map-pin-pulse {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .pulse-dot {
          width: 12px;
          height: 12px;
          background-color: var(--accent-color);
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 6px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .pulse-ring {
          border: 3px solid var(--accent-color);
          border-radius: 50%;
          height: 36px;
          width: 36px;
          position: absolute;
          top: -6px;
          left: -6px;
          animation: mapPulse 2s ease-out infinite;
          opacity: 0;
        }
        @keyframes mapPulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        
        .map-label-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 8px 12px;
          box-shadow: var(--shadow-md);
          text-align: center;
        }
        .map-label-card strong {
          display: block;
          font-size: 0.85rem;
        }
        .map-label-card span {
          display: block;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        
        .map-grid-lines {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .grid-line {
          position: absolute;
          background-color: var(--border-color);
          opacity: 0.5;
        }
        .line-h { width: 100%; height: 1px; }
        .line-v { height: 100%; width: 1px; }
      `}</style>
    </div>
  );
};
