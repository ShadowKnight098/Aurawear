import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, RefreshCw, Star } from 'lucide-react';

export const ProductComparison = () => {
  const { compareList, toggleComparison } = useShop();
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bar at Bottom */}
      <div className="compare-bar animate-fade-in">
        <div className="container compare-bar-inner">
          <div className="compare-info">
            <RefreshCw size={18} className="spin-slow" />
            <span>Compare ({compareList.length}/3)</span>
          </div>
          <div className="compare-thumbs">
            {compareList.map(product => (
              <div key={product.id} className="compare-thumb">
                <img src={product.images[0]} alt={product.name} />
                <button onClick={() => toggleComparison(product)} className="remove-thumb">&times;</button>
              </div>
            ))}
          </div>
          <div className="compare-actions">
            <button 
              onClick={() => setIsOpen(true)} 
              className="btn btn-primary btn-sm"
              disabled={compareList.length < 2}
              title={compareList.length < 2 ? "Add at least 2 items to compare" : ""}
            >
              Compare Now
            </button>
            <button onClick={() => compareList.forEach(p => toggleComparison(p))} className="btn-clear-all">Clear All</button>
          </div>
        </div>
      </div>

      {/* Comparison Modal Matrix */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content compare-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <h3>Compare Products</h3>
              <button onClick={() => setIsOpen(false)} className="modal-close">&times;</button>
            </div>
            
            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    {compareList.map(p => (
                      <th key={p.id} className="compare-product-header">
                        <img src={p.images[0]} alt={p.name} className="compare-table-img" />
                        <h4 className="compare-table-title">{p.name}</h4>
                        <span className="compare-table-price">₹{p.price}</span>
                        <button onClick={() => toggleComparison(p)} className="btn-remove-p">Remove</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-name">Category</td>
                    {compareList.map(p => <td key={p.id}>{p.category}'s {p.subCategory}</td>)}
                  </tr>
                  <tr>
                    <td className="feature-name">Brand</td>
                    {compareList.map(p => <td key={p.id} className="font-semibold">{p.brand}</td>)}
                  </tr>
                  <tr>
                    <td className="feature-name">Fit</td>
                    {compareList.map(p => <td key={p.id}>{p.fit || 'Regular Fit'}</td>)}
                  </tr>
                  <tr>
                    <td className="feature-name">Sizes Available</td>
                    {compareList.map(p => <td key={p.id}>{p.sizes.join(', ')}</td>)}
                  </tr>
                  <tr>
                    <td className="feature-name">Colors</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        <div className="compare-colors-cell">
                          {p.colors.map(c => (
                            <span key={c} className="compare-color-dot" style={{ backgroundColor: c.toLowerCase() }} title={c}></span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="feature-name">Rating</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        <div className="compare-rating-cell">
                          <Star size={14} fill="#ffc107" stroke="#ffc107" />
                          <span className="font-semibold">{p.rating}</span>
                          <span className="text-xs text-muted">({p.reviewsCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="feature-name">Occasions</td>
                    {compareList.map(p => <td key={p.id}>{p.occasions.join(', ')}</td>)}
                  </tr>
                  <tr>
                    <td className="feature-name">Status</td>
                    {compareList.map(p => (
                      <td key={p.id}>
                        <span className={`badge ${p.availability === 'In Stock' ? 'badge-success' : 'badge-status'}`}>
                          {p.availability}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="feature-name">Description</td>
                    {compareList.map(p => <td key={p.id} className="compare-desc-cell">{p.description}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .compare-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.08);
          z-index: 150;
          padding: 12px 0;
        }
        .compare-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        @media (max-width: 600px) {
          .compare-bar-inner {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        .compare-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 0.95rem;
        }
        .spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .compare-thumbs {
          display: flex;
          gap: 12px;
          overflow-x: auto;
        }
        .compare-thumb {
          position: relative;
          width: 50px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .compare-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-thumb {
          position: absolute;
          top: -2px;
          right: -2px;
          background: rgba(0,0,0,0.6);
          color: white;
          border: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .compare-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-clear-all {
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-decoration: underline;
        }
        .btn-clear-all:hover {
          color: var(--text-primary);
        }
        
        /* Modal comparison matrix */
        .compare-modal {
          max-width: 1000px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .compare-modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .compare-table-wrapper {
          overflow-x: auto;
          overflow-y: auto;
          flex: 1;
        }
        .compare-table {
          width: 100%;
          border-collapse: collapse;
        }
        .compare-table th, .compare-table td {
          border-bottom: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          padding: 16px;
          vertical-align: top;
          font-size: 0.9rem;
        }
        .compare-table th:last-child, .compare-table td:last-child {
          border-right: none;
        }
        .feature-name {
          font-weight: 600;
          color: var(--text-secondary);
          background-color: var(--bg-secondary);
          width: 150px;
          position: sticky;
          left: 0;
          z-index: 5;
        }
        .compare-product-header {
          text-align: center;
          min-width: 200px;
        }
        .compare-table-img {
          width: 100px;
          height: 120px;
          object-fit: cover;
          margin: 0 auto 12px;
          border-radius: var(--radius-sm);
        }
        .compare-table-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .compare-table-price {
          display: block;
          font-weight: 700;
          color: var(--accent-color);
          margin-bottom: 12px;
        }
        .btn-remove-p {
          font-size: 0.75rem;
          color: #c93b3b;
          text-decoration: underline;
        }
        .font-semibold {
          font-weight: 600;
        }
        .compare-colors-cell {
          display: flex;
          gap: 6px;
        }
        .compare-color-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .compare-rating-cell {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .compare-desc-cell {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
          text-align: left;
        }
      `}</style>
    </>
  );
};
