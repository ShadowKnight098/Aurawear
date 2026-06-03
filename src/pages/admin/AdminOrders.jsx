import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ArrowLeft, Edit2, MapPin, Truck, LogOut } from 'lucide-react';

export const AdminOrders = () => {
  const { user, orders, updateOrderStatus, logoutUser } = useShop();
  const navigate = useNavigate();

  // Security guard check
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="admin-orders-page section-padding">
      <div className="container">
        
        {/* Title header */}
        <div className="admin-header-row mb-32">
          <div>
            <div className="admin-badge">Admin Dispatch</div>
            <h1>Order Dispatch Management</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} /> Back to storefront
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
          <Link to="/admin/orders" className="admin-tab-btn active">Order Dispatch</Link>
          <Link to="/admin/coupons" className="admin-tab-btn">Discounts & Coupons</Link>
        </div>

        {/* Orders Table */}
        <div className="table-wrapper animate-fade-in">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Ref / Date</th>
                <th>Customer & Address</th>
                <th>Purchased Items</th>
                <th>Order Total</th>
                <th>Dispatch Tracking Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No orders found in checkout logs history.</td>
                </tr>
              ) : (
                orders.map(order => (
                    <tr key={order.id}>
                      <td data-label="Order Ref / Date">
                        <strong>{order.id}</strong>
                        <span className="text-xs text-muted block">{new Date(order.date).toLocaleDateString()}</span>
                      </td>
                      <td data-label="Customer Details">
                        <div className="table-customer-cell">
                          <strong>{order.deliveryDetails.fullName}</strong>
                          <span className="text-xs text-secondary block">{order.deliveryDetails.phone}</span>
                          <span className="text-xs text-muted block flex-wrap-addr">
                            <MapPin size={10} inline="true" /> {order.deliveryDetails.streetAddress}, {order.deliveryDetails.city} - {order.deliveryDetails.zipCode}
                          </span>
                        </div>
                      </td>
                      <td data-label="Purchased Items">
                        <div className="table-items-summary-cell">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="item-line text-xs">
                              {item.quantity}x {item.name} ({item.size}/{item.color})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td data-label="Order Total">
                        <strong>₹{order.total}</strong>
                        <span className="text-xs text-muted block">{order.paymentMethod}</span>
                      </td>
                      <td data-label="Dispatch Status">
                        <div className="status-control-cell">
                          <Truck size={14} className="text-muted" />
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="status-dropdown-select"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table-customer-cell {
          max-width: 250px;
        }
        .flex-wrap-addr {
          white-space: normal;
          line-height: 1.3;
          margin-top: 4px;
        }
        .item-line {
          line-height: 1.4;
          margin-bottom: 4px;
        }
        .status-control-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .status-dropdown-select {
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 12px;
          background-color: var(--bg-primary);
          font-weight: 500;
          font-size: 0.85rem;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
