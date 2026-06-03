import React from 'react';
import { Target, Leaf, Heart, Award } from 'lucide-react';
import { useDocumentSEO } from '../hooks/useDocumentSEO';

export const AboutUs = () => {
  useDocumentSEO({
    title: 'About Our Philosophy & Story',
    description: 'Learn about Aura Wear\'s principles. We craft high-quality organic cotton clothing with zero logo print and honest flat pricing structures.',
    keywords: 'about aura wear, clothing philosophy, organic cotton manufacturer, tagless premium brand'
  });

  return (
    <div className="about-page-wrapper section-padding animate-fade-in">
      <div className="container">
        {/* Banner header */}
        <section className="about-hero text-center mb-60">
          <span className="section-tagline">OUR STORY</span>
          <h1>Minimalist Threads, Honest Craft</h1>
          <p className="text-secondary max-w-700">
            Aura Wear was born in 2024 out of a simple frustration: clothing stores were cluttered, templates felt identical, and fabrics felt increasingly cheap. We set out to design a premium e-commerce sanctuary focusing on absolute quality.
          </p>
        </section>

        {/* Mission / Vision Cards */}
        <section className="about-mission-grid mb-60">
          <div className="mission-card">
            <Target className="mission-icon" size={28} />
            <h3>Our Mission</h3>
            <p>To design timeless, premium clothing basics that flatter every build, and to present them in an online store that values simplicity and trustworthy customer relations above marketing noise.</p>
          </div>

          <div className="mission-card">
            <Leaf className="mission-icon" size={28} />
            <h3>Our Sustainability</h3>
            <p>100% of our combed cotton is organic and GOTS certified. We partner with family-owned sewing guilds in southern India, ensuring living wages and strict chemical-free dyeing procedures.</p>
          </div>
        </section>

        {/* Core Values grid */}
        <section className="about-values-section mb-60 text-center">
          <h2 className="mb-12">Core Principles</h2>
          <p className="text-secondary mb-32">What guides our fabric weaving and catalog curation.</p>
          
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon"><Award size={20} /></div>
              <h4>No Logo Policy</h4>
              <p>We believe you should be recognized for your posture and taste, not the badge on your chest. Our garments remain cleanly logoless.</p>
            </div>

            <div className="value-item">
              <div className="value-icon"><Heart size={20} /></div>
              <h4>Flat Pricing</h4>
              <p>No artificial inflated markups. We calculate the cost of high-grade raw linen or French terry cotton fairly and sell it transparently.</p>
            </div>

            <div className="value-item">
              <div className="value-icon"><Leaf size={20} /></div>
              <h4>Eco packaging</h4>
              <p>Every order dispatch is wrapped in compostable paper and sent inside reusable corrugated boxes. Zero plastic wraps, period.</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .max-w-700 {
          max-width: 700px;
          margin: 12px auto 0;
        }
        .mb-60 {
          margin-bottom: 60px;
        }
        .mb-32 {
          margin-bottom: 32px;
        }
        .mb-12 {
          margin-bottom: 12px;
        }
        .about-hero {
          margin-top: 40px;
        }
        .about-hero h1 {
          font-size: 2.5rem;
          margin-top: 6px;
        }
        
        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .about-mission-grid {
            grid-template-columns: 1fr;
          }
        }
        .mission-card {
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          padding: 32px;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }
        .mission-icon {
          color: var(--accent-color);
          margin-bottom: 16px;
        }
        .mission-card h3 {
          font-size: 1.25rem;
          margin-bottom: 10px;
        }
        .mission-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) {
          .values-grid {
            grid-template-columns: 1fr;
          }
        }
        .value-item {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .value-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--accent-light);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .value-item h4 {
          font-size: 1.05rem;
          font-weight: 600;
        }
        .value-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};
