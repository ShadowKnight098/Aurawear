import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, Clipboard, ShoppingBag, Truck } from 'lucide-react';

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const { orders } = useShop();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      const match = orders.find(o => o.id === orderId);
      if (match) {
        setOrder(match);
      }
    }
  }, [orderId, orders]);

  const handleCopyCode = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!orderId) {
    return (
      <div className="container section-padding text-center">
        <h2>Order Success</h2>
        <p className="text-secondary mb-16">No order code supplied.</p>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="success-page-wrapper section-padding">
      <div className="container success-container text-center animate-scale-in">
        <CheckCircle2 size={64} className="success-icon-main" />
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-tagline text-secondary">Thank you for shopping with Aura Wear. Your order has been registered.</p>

        {order && (
          <div className="success-card text-left">
            <div className="success-card-header">
              <div>
                <span>Order Reference:</span>
                <div className="reference-code-row">
                  <strong>{order.id}</strong>
                  <button onClick={handleCopyCode} className="btn-copy-ref" title="Copy tracking ID">
                    <Clipboard size={14} /> {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <span>Order Total:</span>
                <strong>₹{order.total}</strong>
              </div>
            </div>

            <div className="success-card-body">
              <h4>Delivery Address:</h4>
              <p className="address-block">
                {order.deliveryDetails.fullName}<br />
                {order.deliveryDetails.streetAddress}<br />
                {order.deliveryDetails.city}, {order.deliveryDetails.state} - {order.deliveryDetails.zipCode}<br />
                Phone: {order.deliveryDetails.phone}
              </p>
              
              <div className="success-info-notice">
                <Truck size={18} />
                <span>You can track your order dispatch timeline inside your Account Dashboard or on our tracking page.</span>
              </div>
            </div>
          </div>
        )}

        <div className="success-actions">
          <Link to={`/track-order?id=${orderId}`} className="btn btn-primary">
            Track Order Dispatch
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        .success-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .success-icon-main {
          color: #248a52;
          margin-bottom: 20px;
        }
        .success-title {
          font-size: 2.2rem;
          margin-bottom: 8px;
        }
        .success-tagline {
          font-size: 1.05rem;
          margin-bottom: 40px;
        }
        
        .success-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          overflow: hidden;
          margin-bottom: 32px;
          box-shadow: var(--shadow-sm);
        }
        .success-card-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .success-card-header span {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .reference-code-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-copy-ref {
          font-size: 0.75rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 2px 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .success-card-body {
          padding: 24px;
        }
        .success-card-body h4 {
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        .address-block {
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-primary);
        }
        .success-info-notice {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background-color: var(--bg-primary);
          border-radius: var(--radius-md);
          padding: 16px;
          margin-top: 24px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
          border: 1px solid var(--border-color);
        }
        .success-info-notice svg {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        
        .success-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        @media (max-width: 480px) {
          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};
