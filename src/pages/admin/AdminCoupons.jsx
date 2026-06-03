import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Percent, Plus, Trash2, Tag, Calendar, Check, LogOut, ShieldAlert } from 'lucide-react';

const getFutureDateString = (monthsAhead = 1) => {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  return d.toISOString().split('T')[0];
};

export const AdminCoupons = () => {
  const { user, coupons, adminCreateCoupon, adminDeleteCoupon, logoutUser } = useShop();
  const navigate = useNavigate();

  // Security guard check
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('10');
  const [newExpiry, setNewExpiry] = useState(() => getFutureDateString(3));
  const [newUsageLimit, setNewUsageLimit] = useState('100');
  const [newMinCartAmount, setNewMinCartAmount] = useState('0');
  const [newCategoryRestriction, setNewCategoryRestriction] = useState('All');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user || !user.isAdmin) return null;

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    await adminCreateCoupon({
      code: newCode.trim().toUpperCase(),
      discount_percent: Number(newDiscount),
      expiry_date: newExpiry,
      usage_limit: Number(newUsageLimit),
      min_cart_amount: Number(newMinCartAmount),
      category_restriction: newCategoryRestriction
    });

    setNewCode('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const handleDeleteCoupon = (code) => {
    adminDeleteCoupon(code);
  };

  return (
    <div className="admin-coupons-page section-padding">
      <div className="container">
        
        {/* Title header */}
        <div className="admin-header-row mb-32">
          <div>
            <div className="admin-badge">Admin Promotions</div>
            <h1>Coupon & Discounts Management</h1>
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
          <Link to="/admin" className="admin-tab-btn">Overview</Link>
          <Link to="/admin/products" className="admin-tab-btn">Products Catalog</Link>
          <Link to="/admin/orders" className="admin-tab-btn">Order Dispatch</Link>
          <Link to="/admin/coupons" className="admin-tab-btn active">Discounts & Coupons</Link>
        </div>

        <div className="admin-coupons-layout">
          {/* Active Coupons List */}
          <div className="table-wrapper animate-fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Promo Code</th>
                  <th>Discount Rate</th>
                  <th>Expiry Date</th>
                  <th>Conditions</th>
                  <th>Usage (Used/Limit)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.code}>
                    <td data-label="Promo Code" className="coupon-code-cell">
                      <Tag size={14} className="text-muted" />
                      <strong>{c.code}</strong>
                    </td>
                    <td data-label="Discount Rate">
                      <span className="badge badge-success font-semibold">{c.discount_percent}% OFF</span>
                    </td>
                    <td data-label="Expiry Date">
                      <span className="text-xs text-secondary flex-center-gap">
                        <Calendar size={12} /> 
                        {new Date(c.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td data-label="Conditions">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className="text-xs text-secondary">Min Cart: <strong>₹{c.min_cart_amount || 0}</strong></span>
                        <span className="text-xs text-secondary">Category: <strong>{c.category_restriction || 'All'}</strong></span>
                      </div>
                    </td>
                    <td data-label="Usage">
                      <span className="text-sm font-semibold">{c.usage_count || 0}</span>
                      <span className="text-xs text-muted"> / {c.usage_limit || 100} used</span>
                    </td>
                    <td data-label="Action">
                      <button onClick={() => handleDeleteCoupon(c.code)} className="btn-delete" title="Delete Promo Rule">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-24">
                      No active coupons found. Create one on the right!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Create Coupon sidebar panel */}
          <form onSubmit={handleCreateCoupon} className="create-coupon-panel animate-scale-in">
            <h3>Create Promo Rule</h3>
            <p className="text-secondary mb-16">Define code name, discount rate, and conditions.</p>
            
            <div className="form-group">
              <label className="form-label">Promo Code</label>
              <input 
                type="text" 
                required
                placeholder="e.g. AUTUMN15" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="form-input code-uppercase-input"
              />
            </div>

            <div className="form-row-2 animate-fade-in">
              <div className="form-group">
                <label className="form-label">Discount Rate (%)</label>
                <select value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} className="form-input">
                  <option value="5">5% Discount</option>
                  <option value="10">10% Discount</option>
                  <option value="15">15% Discount</option>
                  <option value="20">20% Discount</option>
                  <option value="25">25% Discount</option>
                  <option value="30">30% Discount</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Usage Limit</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={newUsageLimit}
                  onChange={(e) => setNewUsageLimit(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row-2 animate-fade-in">
              <div className="form-group">
                <label className="form-label">Min Cart Spend (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  value={newMinCartAmount}
                  onChange={(e) => setNewMinCartAmount(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category restriction</label>
                <select value={newCategoryRestriction} onChange={(e) => setNewCategoryRestriction(e.target.value)} className="form-input">
                  <option value="All">All Categories</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            <div className="form-group animate-fade-in">
              <label className="form-label">Expiry Date</label>
              <input 
                type="date" 
                required
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="form-input"
              />
            </div>

            {isSuccess && (
              <div className="success-coupon-msg animate-fade-in mb-12">
                <Check size={14} /> Coupon rule created successfully!
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              <Plus size={16} /> Register Promo Code
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .admin-coupons-layout {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .admin-coupons-layout {
            grid-template-columns: 1fr;
          }
        }
        .coupon-code-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .flex-center-gap {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .create-coupon-panel {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }
        .create-coupon-panel h3 {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .code-uppercase-input {
          text-transform: uppercase;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .success-coupon-msg {
          background-color: #e3f5eb;
          color: #248a52;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </div>
  );
};
