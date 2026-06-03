import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Search, MapPin, Truck, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const { orders } = useShop();
  
  const [trackingInput, setTrackingInput] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto load tracking details if present in URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingInput(id);
      handleTrack(id);
    }
  }, [searchParams, orders]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    handleTrack(trackingInput.trim());
  };

  const handleTrack = (id) => {
    setErrorMsg('');
    const match = orders.find(o => o.id.toLowerCase() === id.toLowerCase());
    if (match) {
      setActiveOrder(match);
    } else {
      setActiveOrder(null);
      setErrorMsg('No active order found matching this Tracking ID. Please double check.');
    }
  };

  return (
    <div className="tracking-page-wrapper section-padding">
      <div className="container tracking-container">
        <h1 className="tracking-title">Track Your Shipment</h1>
        
        {/* Tracking Code input box */}
        <form onSubmit={handleTrackSubmit} className="tracking-search-form">
          <div className="tracking-input-wrapper">
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Enter Order Reference Number (e.g. ORD-98273-AU)"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="tracking-input-field"
            />
            <button type="submit" className="btn btn-primary btn-sm">Track</button>
          </div>
          {errorMsg && <p className="tracking-error animate-fade-in">{errorMsg}</p>}
        </form>

        {/* Live Tracking Result Info */}
        {activeOrder ? (
          <div className="tracking-result-box animate-scale-in">
            <div className="tracking-result-header">
              <div className="header-meta-item">
                <span>Shipment Reference</span>
                <strong>{activeOrder.id}</strong>
              </div>
              <div className="header-meta-item">
                <span>Shipping Method</span>
                <strong>Express Courier</strong>
              </div>
              <div className="header-meta-item">
                <span>Delivery Destination</span>
                <strong>{activeOrder.deliveryDetails.city}, {activeOrder.deliveryDetails.state}</strong>
              </div>
            </div>

            {/* Timeline Progress Tracker */}
            <div className="tracking-timeline-flow">
              {activeOrder.timeline.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`timeline-step-row ${step.completed ? 'completed' : ''} ${activeOrder.status === step.status ? 'active-current' : ''}`}
                >
                  <div className="timeline-node-column">
                    <div className="timeline-node-circle">
                      {step.completed ? <CheckCircle2 size={16} fill="var(--accent-color)" stroke="var(--bg-primary)" /> : <div className="inner-dot"></div>}
                    </div>
                    {idx < activeOrder.timeline.length - 1 && <div className="timeline-line-track"></div>}
                  </div>
                  <div className="timeline-text-column">
                    <div className="timeline-status-title">
                      <h3>{step.status}</h3>
                      {step.date && <span className="step-timestamp"><Calendar size={12} /> {step.date}</span>}
                    </div>
                    <p className="timeline-status-desc">
                      {step.status === 'Ordered' && 'Your order was successfully registered on our servers. Processing payment clearance.'}
                      {step.status === 'Packed' && 'Garments selected, inspected for loose threads, and wrapped in premium biodegradable boxes.'}
                      {step.status === 'Shipped' && 'Handed over to carrier transit depot. Tracking dispatch code assigned.'}
                      {step.status === 'Out for Delivery' && 'Arrived at destination hub. Dispatch courier out on delivery route.'}
                      {step.status === 'Delivered' && 'Package successfully delivered and signed by customer.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipment Summary Panel */}
            <div className="tracking-shipment-details mt-24">
              <h4>Package Summary</h4>
              <div className="shipment-items-summary">
                {activeOrder.items.map(item => (
                  <div key={item.key} className="shipment-item-row">
                    <img src={item.image} alt="" />
                    <div className="item-text">
                      <h5>{item.name}</h5>
                      <span>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="tracking-placeholder text-center">
            <Truck size={48} className="text-muted mb-16" />
            <p className="text-secondary">Please enter your 10-character Order Reference ID above to see real-time dispatch progress.</p>
          </div>
        )}
      </div>

      <style>{`
        .tracking-container {
          max-width: 700px;
          margin: 0 auto;
        }
        .tracking-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
          text-align: center;
        }
        
        .tracking-search-form {
          margin-bottom: 40px;
        }
        .tracking-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          transition: var(--transition-fast);
        }
        .tracking-input-wrapper:focus-within {
          border-color: var(--border-focus);
          background-color: var(--bg-primary);
          box-shadow: 0 0 0 2px var(--accent-light);
        }
        .tracking-input-field {
          flex: 1;
          font-size: 0.95rem;
        }
        .tracking-error {
          color: #c93b3b;
          font-size: 0.85rem;
          margin-top: 8px;
          font-weight: 500;
          text-align: center;
        }
        
        /* Result details */
        .tracking-result-box {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-primary);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .tracking-result-header {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          padding: 20px 24px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }
        @media (max-width: 576px) {
          .tracking-result-header {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
        .header-meta-item span {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .header-meta-item strong {
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        /* Timeline flow chart */
        .tracking-timeline-flow {
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
        }
        .timeline-step-row {
          display: flex;
          gap: 20px;
        }
        .timeline-node-column {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .timeline-node-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          background-color: var(--bg-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-normal);
          z-index: 2;
        }
        .timeline-node-circle .inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--border-color);
        }
        .timeline-line-track {
          width: 2px;
          flex: 1;
          min-height: 50px;
          background-color: var(--border-color);
          margin: 4px 0;
        }
        .timeline-text-column {
          flex: 1;
          padding-bottom: 24px;
        }
        .timeline-status-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }
        .timeline-status-title h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .step-timestamp {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .timeline-status-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
        }
        
        /* Completed Step Styling */
        .timeline-step-row.completed .timeline-node-circle {
          border-color: var(--accent-color);
        }
        .timeline-step-row.completed .timeline-line-track {
          background-color: var(--accent-color);
        }
        .timeline-step-row.completed .timeline-status-title h3 {
          color: var(--text-primary);
        }
        .timeline-step-row.completed .timeline-status-desc {
          color: var(--text-secondary);
        }
        
        /* Active current node styling */
        .timeline-step-row.active-current .timeline-node-circle {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 4px var(--accent-light);
        }
        .timeline-step-row.active-current .timeline-status-title h3 {
          color: var(--accent-color);
          font-weight: 700;
        }
        
        .tracking-shipment-details {
          border-top: 1px solid var(--border-color);
          padding: 24px;
        }
        .tracking-shipment-details h4 {
          font-size: 0.95rem;
          margin-bottom: 16px;
        }
        .shipment-items-summary {
          display: grid;
          gap: 12px;
        }
        .shipment-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .shipment-item-row img {
          width: 40px;
          height: 48px;
          object-fit: cover;
          border-radius: 4px;
        }
        .item-text h5 {
          font-size: 0.85rem;
          font-weight: 500;
        }
        .item-text span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .tracking-placeholder {
          padding: 60px 20px;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
        }
      `}</style>
    </div>
  );
};
