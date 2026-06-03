import React from 'react';

export const SkeletonLoader = ({ type = 'product', count = 4 }) => {
  const renderItems = () => {
    return [...Array(count)].map((_, idx) => {
      if (type === 'product') {
        return (
          <div key={idx} className="skeleton-card">
            <div className="skeleton skeleton-media"></div>
            <div className="skeleton-info">
              <div className="skeleton skeleton-text skeleton-title"></div>
              <div className="skeleton skeleton-text skeleton-sub"></div>
              <div className="skeleton skeleton-text skeleton-price"></div>
            </div>
          </div>
        );
      }
      return (
        <div key={idx} className="skeleton-generic">
          <div className="skeleton skeleton-bar"></div>
        </div>
      );
    });
  };

  return (
    <>
      <div className={`skeleton-grid ${type === 'product' ? 'product-grid-layout' : ''}`}>
        {renderItems()}
      </div>

      <style>{`
        .skeleton-grid {
          display: grid;
          gap: 24px;
        }
        .product-grid-layout {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        }
        @media (max-width: 576px) {
          .product-grid-layout {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        .skeleton-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: var(--bg-primary);
        }
        .skeleton-media {
          padding-top: 120%; /* match card ratio */
        }
        .skeleton-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .skeleton-text {
          height: 14px;
        }
        .skeleton-title {
          width: 70%;
          height: 18px;
        }
        .skeleton-sub {
          width: 40%;
        }
        .skeleton-price {
          width: 25%;
          height: 16px;
          margin-top: 8px;
        }
        .skeleton-bar {
          height: 24px;
          width: 100%;
          margin-bottom: 12px;
        }
      `}</style>
    </>
  );
};
