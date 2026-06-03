import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { 
  TrendingUp, ShoppingBag, Percent, Users, 
  ArrowLeft, ChevronRight, Package, Calendar, LogOut 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, orders, products, activeCoupons, logoutUser } = useShop();
  const navigate = useNavigate();

  // Product Code Lookup State
  const [lookupCode, setLookupCode] = useState('');
  const [lookupProduct, setLookupProduct] = useState(null);
  const [lookupMessage, setLookupMessage] = useState('Enter a 5-digit product code to view its details.');

  const handleLookupChange = (e) => {
    const val = e.target.value.trim();
    setLookupCode(val);
    
    if (val.length === 5) {
      const found = products.find(p => p.productCode === val);
      if (found) {
        setLookupProduct(found);
        setLookupMessage('');
      } else {
        setLookupProduct(null);
        setLookupMessage(`No product found with code "${val}".`);
      }
    } else {
      setLookupProduct(null);
      setLookupMessage('Enter a 5-digit product code to view its details.');
    }
  };

  // Security guard check
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  // Analytics Math
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const couponCount = Object.keys(activeCoupons).length;

  // Native CSS bar graph mock points (representing last 6 months sales)
  const salesHistory = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 58000 },
    { month: 'Mar', revenue: 72000 },
    { month: 'Apr', revenue: 91000 },
    { month: 'May', revenue: 84000 },
    { month: 'Jun', revenue: totalRevenue > 0 ? totalRevenue : 65000 }
  ];

  const maxRevenue = Math.max(...salesHistory.map(s => s.revenue));

  // Recent order list
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="admin-dashboard-page section-padding">
      <div className="container">
        
        {/* Title header */}
        <div className="admin-header-row mb-32">
          <div>
            <div className="admin-badge">Admin Workspace</div>
            <h1>Management Dashboard</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} /> Back to Storefront
            </Link>
            <button 
              onClick={() => { logoutUser(); navigate('/'); }} 
              className="btn btn-secondary btn-sm"
              style={{ color: '#c93b3b' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="admin-nav-tabs mb-32">
          <Link to="/admin" className="admin-tab-btn active">Overview</Link>
          <Link to="/admin/products" className="admin-tab-btn">Products Catalog</Link>
          <Link to="/admin/orders" className="admin-tab-btn">Order Dispatch</Link>
          <Link to="/admin/coupons" className="admin-tab-btn">Discounts & Coupons</Link>
        </div>

        {/* Metric stats grid */}
        <div className="stats-grid mb-32">
          <div className="stat-card">
            <div className="stat-icon-wrapper rev-icon"><TrendingUp size={20} /></div>
            <div className="stat-info">
              <span>Gross Sales Revenue</span>
              <h2>₹{totalRevenue.toLocaleString('en-IN')}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orders-icon"><ShoppingBag size={20} /></div>
            <div className="stat-info">
              <span>Total Orders Placed</span>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper aov-icon"><Users size={20} /></div>
            <div className="stat-info">
              <span>Avg. Order Value</span>
              <h2>₹{avgOrderValue.toLocaleString('en-IN')}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper coupons-icon"><Percent size={20} /></div>
            <div className="stat-info">
              <span>Active Promo Codes</span>
              <h2>{couponCount}</h2>
            </div>
          </div>
        </div>

        {/* Product Code Lookup Panel */}
        <div className="admin-card mb-32" style={{ backgroundColor: 'var(--bg-secondary)', border: '1.5px solid var(--accent-color)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>Product Quick Lookup</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Identify items easily by typing their 5-digit unique code.</p>
            </div>
            
            <div className="lookup-content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '24px', alignItems: 'start' }}>
              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>5-Digit Product Code</label>
                <input 
                  type="text" 
                  maxLength={5}
                  value={lookupCode}
                  onChange={handleLookupChange}
                  placeholder="e.g. 10001"
                  className="form-input"
                  style={{ width: '100%', fontSize: '1.1rem', padding: '12px 16px', letterSpacing: '0.05em' }}
                />
              </div>

              <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
                {lookupProduct ? (
                  <div className="lookup-result-row" style={{ display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start' }}>
                    <img 
                      src={lookupProduct.images[0]} 
                      alt="" 
                      style={{ width: '80px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{lookupProduct.name}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '600', textTransform: 'uppercase' }}>
                            Code: {lookupProduct.productCode} &bull; {lookupProduct.category} &bull; {lookupProduct.subCategory}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>₹{lookupProduct.price}</span>
                          <span className={`badge ${lookupProduct.stock > 0 ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                            {lookupProduct.stock > 0 ? `${lookupProduct.stock} In Stock` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.8rem' }}>
                        <div>
                          <strong>Available Sizes:</strong> {lookupProduct.sizes.join(', ')}
                        </div>
                        <div>
                          <strong>Colors:</strong> {lookupProduct.colors.join(', ')}
                        </div>
                        {lookupProduct.fit && (
                          <div>
                            <strong>Fit:</strong> {lookupProduct.fit}
                          </div>
                        )}
                        {lookupProduct.brand && (
                          <div>
                            <strong>Brand:</strong> {lookupProduct.brand}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center', margin: 0 }}>
                    {lookupMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Recent Orders Grid */}
        <div className="admin-main-grid mb-32">
          {/* Native HTML Sales Activity Chart */}
          <div className="admin-card chart-card">
            <h3>Sales Activity (₹)</h3>
            <div className="bar-chart-container">
              {salesHistory.map((pt, idx) => {
                const heightPercent = maxRevenue > 0 ? (pt.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={idx} className="chart-bar-col">
                    <div className="bar-hover-val">₹{pt.revenue.toLocaleString('en-IN')}</div>
                    <div className="chart-bar-track">
                      <div className="chart-bar-fill" style={{ height: `${heightPercent}%` }}></div>
                    </div>
                    <span className="chart-label">{pt.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="admin-card orders-card">
            <div className="card-header-row">
              <h3>Recent Orders</h3>
              <Link to="/admin/orders" className="view-all-link">Manage All <ChevronRight size={14} /></Link>
            </div>
            
            <div className="recent-orders-list">
              {recentOrders.length === 0 ? (
                <p className="no-data text-center">No orders placed in sandbox environment yet.</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="recent-order-row">
                    <div className="order-row-meta">
                      <Package size={16} className="text-muted" />
                      <div>
                        <strong>{order.id}</strong>
                        <span className="row-date"><Calendar size={12} /> {new Date(order.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="order-row-price">
                      <strong>₹{order.total}</strong>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-status'}`}>{order.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 40px;
        }
        .admin-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-color);
          background-color: var(--accent-light);
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .admin-header-row h1 {
          font-size: 2.2rem;
        }
        
        .admin-nav-tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
        }
        .admin-tab-btn {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-muted);
          padding: 12px 20px;
          border-bottom: 2px solid transparent;
          transition: var(--transition-fast);
        }
        .admin-tab-btn:hover {
          color: var(--text-primary);
        }
        .admin-tab-btn.active {
          color: var(--accent-color);
          border-bottom-color: var(--accent-color);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .stat-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
        }
        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rev-icon { background-color: #e3f5eb; color: #248a52; }
        .orders-icon { background-color: #e8f0fe; color: #1a73e8; }
        .aov-icon { background-color: #fef3d6; color: #f1b000; }
        .coupons-icon { background-color: #fce8e6; color: #d93025; }
        
        .stat-info span {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }
        .stat-info h2 {
          font-size: 1.5rem;
          font-weight: 700;
        }

        /* Chart section */
        .admin-main-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 32px;
        }
        @media (max-width: 992px) {
          .admin-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .admin-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: var(--shadow-sm);
        }
        .admin-card h3 {
          font-size: 1.2rem;
          margin-bottom: 24px;
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .card-header-row h3 {
          margin-bottom: 0;
        }
        .view-all-link {
          font-size: 0.85rem;
          color: var(--accent-color);
          display: flex;
          align-items: center;
          gap: 2px;
          font-weight: 500;
        }
        
        /* Bar chart */
        .bar-chart-container {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 240px;
          padding-top: 30px;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 12px;
        }
        .chart-bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          position: relative;
        }
        .bar-hover-val {
          position: absolute;
          top: -24px;
          background-color: var(--text-primary);
          color: var(--bg-primary);
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0;
          pointer-events: none;
          transition: opacity var(--transition-fast);
          white-space: nowrap;
        }
        .chart-bar-col:hover .bar-hover-val {
          opacity: 1;
        }
        .chart-bar-track {
          flex: 1;
          width: 32px;
          background-color: var(--bg-secondary);
          border-radius: 16px 16px 0 0;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .chart-bar-track {
            width: 16px;
          }
        }
        .chart-bar-fill {
          width: 100%;
          background-color: var(--accent-color);
          border-radius: 16px 16px 0 0;
          transition: height 1s;
        }
        .chart-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-top: 10px;
        }
        
        /* Recent orders list */
        .recent-orders-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .recent-order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }
        .recent-order-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .order-row-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-row-meta strong {
          font-size: 0.9rem;
          display: block;
        }
        .row-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .order-row-price {
          text-align: right;
        }
        .order-row-price strong {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  );
};
