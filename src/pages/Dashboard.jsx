import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { User, ShoppingBag, MapPin, Settings, LogOut, CheckCircle, AlertCircle, Truck, Plus, Trash2, Edit } from 'lucide-react';

export const Dashboard = () => {
  const { 
    user, logoutUser, orders, addresses, addUserAddress, removeUserAddress,
    updateProfile, sendPasswordResetEmail, editUserAddress
  } = useShop();
  
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('orders');

  // Address edit state
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newStateVal, setNewStateVal] = useState('');
  const [newZip, setNewZip] = useState('');
  const [editingAddress, setEditingAddress] = useState(null);

  // Profile Settings State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password Reset State
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState('');

  // Sync profile details if user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  if (!user) return null;

  // Handle updating user profile name and phone number
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);
    setUpdateError('');

    try {
      const res = await updateProfile({ name: profileName, phone: profilePhone });
      if (res.success) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setUpdateError(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      setUpdateError('An unexpected error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle sending password reset recovery email via Supabase Auth
  const handleSendPasswordReset = async () => {
    setIsSendingReset(true);
    setPasswordResetSent(false);
    setPasswordResetError('');
    try {
      const res = await sendPasswordResetEmail(user.email);
      if (res.success) {
        setPasswordResetSent(true);
      } else {
        setPasswordResetError(res.message || 'Failed to send recovery email.');
      }
    } catch (err) {
      setPasswordResetError('An unexpected error occurred.');
    } finally {
      setIsSendingReset(false);
    }
  };

  // Handle start editing existing address
  const handleStartEditAddress = (addr) => {
    setEditingAddress(addr);
    setNewFullName(addr.fullName);
    setNewPhone(addr.phone);
    setNewStreet(addr.streetAddress);
    setNewCity(addr.city);
    setNewStateVal(addr.state);
    setNewZip(addr.zipCode);
    setShowAddAddressForm(true);
  };

  // Handle adding or editing shipping address
  const handleSubmitAddress = (e) => {
    e.preventDefault();
    if (editingAddress) {
      // Edit mode
      const updatedAddr = {
        ...editingAddress,
        fullName: newFullName,
        phone: newPhone,
        streetAddress: newStreet,
        city: newCity,
        state: newStateVal,
        zipCode: newZip
      };
      editUserAddress(updatedAddr);
      setEditingAddress(null);
    } else {
      // Add mode
      const newAddr = {
        id: `addr-${Date.now()}`,
        fullName: newFullName,
        phone: newPhone,
        streetAddress: newStreet,
        city: newCity,
        state: newStateVal,
        zipCode: newZip,
        country: 'India',
        isDefault: addresses.length === 0
      };
      addUserAddress(newAddr);
    }
    
    // Reset Form
    setNewFullName('');
    setNewPhone('');
    setNewStreet('');
    setNewCity('');
    setNewStateVal('');
    setNewZip('');
    setShowAddAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    removeUserAddress(id);
  };

  return (
    <div className="dashboard-page-wrapper section-padding">
      <div className="container dashboard-container animate-scale-in">
        <h1 className="dashboard-title">My Account</h1>

        <div className="dashboard-layout">
          {/* Sidebar Navigation */}
          <aside className="dashboard-sidebar">
            <div className="user-profile-header">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="profile-meta">
                <h3>{user.name}</h3>
                <span className="text-muted">{user.email}</span>
                {user.isAdmin && <span className="admin-tag badge">Admin</span>}
              </div>
            </div>

            <nav className="dashboard-nav-menu">
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`dashboard-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <ShoppingBag size={18} /> Order History
              </button>
              
              <button 
                onClick={() => setActiveTab('addresses')} 
                className={`dashboard-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              >
                <MapPin size={18} /> Saved Addresses
              </button>

              <button 
                onClick={() => setActiveTab('profile')} 
                className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              >
                <User size={18} /> Profile Settings
              </button>

              {user.isAdmin && (
                <Link to="/admin" className="dashboard-nav-item admin-nav-item">
                  <Settings size={18} /> Admin Dashboard Control
                </Link>
              )}

              <button 
                onClick={() => { logoutUser(); navigate('/'); }} 
                className="dashboard-nav-item logout-btn"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          {/* Core Content Body Panel */}
          <main className="dashboard-content">
            
            {/* Tab: Order History */}
            {activeTab === 'orders' && (
              <div className="dashboard-tab-panel animate-fade-in">
                <h2>Your Orders ({orders.length})</h2>
                <p className="text-secondary mb-20">Inspect payment details, shipping history, or track active shipments.</p>
                
                {orders.length === 0 ? (
                  <div className="no-panel-content text-center">
                    <ShoppingBag size={32} className="text-muted mb-12" />
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn btn-primary btn-sm mt-12">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="orders-history-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-history-card">
                        <div className="order-card-header">
                          <div className="header-meta">
                            <span>Order Date</span>
                            <strong>{new Date(order.date).toLocaleDateString()}</strong>
                          </div>
                          <div className="header-meta">
                            <span>Reference</span>
                            <strong>{order.id}</strong>
                          </div>
                          <div className="header-meta">
                            <span>Total Payment</span>
                            <strong>₹{order.total}</strong>
                          </div>
                          <div className="order-status-badge-col">
                            <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-status'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="order-card-body">
                          <div className="order-items-mini-list">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="order-mini-item">
                                <img src={item.image} alt="" />
                                <div className="mini-item-info">
                                  <h4>{item.name}</h4>
                                  <span>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="order-card-actions">
                            <Link to={`/track-order?id=${order.id}`} className="btn btn-secondary btn-sm">
                              <Truck size={14} /> Track Shipment Status
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="dashboard-tab-panel animate-fade-in">
                <div className="panel-header-row mb-20">
                  <div>
                    <h2>Saved Addresses</h2>
                    <p className="text-secondary">Manage shipping address presets for checkout forms.</p>
                  </div>
                  <button onClick={() => { setShowAddAddressForm(!showAddAddressForm); setEditingAddress(null); }} className="btn btn-primary btn-sm">
                    <Plus size={16} /> Add Address
                  </button>
                </div>

                {showAddAddressForm && (
                  <form onSubmit={handleSubmitAddress} className="add-address-form-box animate-scale-in mb-24">
                    <h3>{editingAddress ? 'Edit Shipping Address' : 'Add Shipping Address'}</h3>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" required value={newFullName} onChange={(e) => setNewFullName(e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input type="tel" required value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="form-input" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input type="text" required value={newStreet} onChange={(e) => setNewStreet(e.target.value)} className="form-input" />
                    </div>
                    <div className="form-row-3">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input type="text" required value={newCity} onChange={(e) => setNewCity(e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State</label>
                        <input type="text" required value={newStateVal} onChange={(e) => setNewStateVal(e.target.value)} className="form-input" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input type="text" required maxLength={6} value={newZip} onChange={(e) => setNewZip(e.target.value)} className="form-input" />
                      </div>
                    </div>
                    <div className="form-actions mt-12">
                      <button type="submit" className="btn btn-primary btn-sm">{editingAddress ? 'Update Address' : 'Save Address'}</button>
                      <button 
                        type="button" 
                        onClick={() => { 
                          setShowAddAddressForm(false); 
                          setEditingAddress(null);
                          setNewFullName('');
                          setNewPhone('');
                          setNewStreet('');
                          setNewCity('');
                          setNewStateVal('');
                          setNewZip('');
                        }} 
                        className="btn btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <div className="no-panel-content text-center">
                    <MapPin size={32} className="text-muted mb-12" />
                    <p>No saved addresses found.</p>
                  </div>
                ) : (
                  <div className="addresses-grid-dashboard">
                    {addresses.map(addr => (
                      <div key={addr.id} className="address-card-dashboard">
                        <div className="addr-card-header">
                          <strong>{addr.fullName}</strong>
                          {addr.isDefault && <span className="badge badge-success font-semibold text-xs ml-8">Default</span>}
                        </div>
                        <p className="addr-card-text">
                          {addr.streetAddress}<br />
                          {addr.city}, {addr.state} - {addr.zipCode}<br />
                          Phone: {addr.phone}
                        </p>
                        <div className="addr-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button onClick={() => handleStartEditAddress(addr)} className="btn-edit-addr" style={{ fontSize: '0.8rem', color: 'var(--accent-color)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="btn-delete-addr">
                            <Trash2 size={14} /> Remove Address
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Profile settings */}
            {activeTab === 'profile' && (
              <div className="dashboard-tab-panel animate-fade-in">
                <h2>Profile Details</h2>
                <p className="text-secondary mb-20">Edit or update your account profile and mobile number settings.</p>
                
                <form className="profile-form-mock" onSubmit={handleUpdateProfile}>
                  {updateSuccess && (
                    <div className="alert alert-success animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#248a52', backgroundColor: '#e3f5eb', padding: '10px 16px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
                      <CheckCircle size={16} /> Profile changes updated successfully!
                    </div>
                  )}
                  {updateError && (
                    <div className="alert alert-error animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c93b3b', backgroundColor: '#f7e8e8', padding: '10px 16px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
                      <AlertCircle size={16} /> {updateError}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      disabled 
                      value={user.email} 
                      className="form-input" 
                      style={{ opacity: 0.6 }} 
                    />
                    <p className="help-text">Email address changes require sandbox secure verification.</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={profilePhone} 
                      onChange={(e) => setProfilePhone(e.target.value)} 
                      placeholder="+91 XXXXX XXXXX" 
                      className="form-input" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className="btn btn-primary mt-12 btn-sm"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>

                <div className="divider" style={{ margin: '32px 0 24px 0', borderTop: '1px solid var(--border-color)' }}></div>

                <div className="password-reset-section" style={{ maxWidth: '500px' }}>
                  <h3>Account Security</h3>
                  <p className="text-secondary mb-12" style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                    Click below to receive a password reset link at your registered email address <strong>{user.email}</strong>.
                  </p>
                  {passwordResetSent && (
                    <div className="alert alert-success animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#248a52', backgroundColor: '#e3f5eb', padding: '10px 16px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '12px' }}>
                      <CheckCircle size={16} /> Password reset email has been sent! Check your inbox.
                    </div>
                  )}
                  {passwordResetError && (
                    <div className="alert alert-error animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c93b3b', backgroundColor: '#f7e8e8', padding: '10px 16px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '12px' }}>
                      <AlertCircle size={16} /> {passwordResetError}
                    </div>
                  )}
                  <button 
                    type="button" 
                    onClick={handleSendPasswordReset} 
                    disabled={isSendingReset} 
                    className="btn btn-secondary btn-sm"
                  >
                    {isSendingReset ? 'Sending Recovery Link...' : 'Send Password Reset Email'}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .dashboard-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        
        .dashboard-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 40px;
        }
        @media (max-width: 992px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
          }
        }
        
        /* Sidebar styling */
        .dashboard-sidebar {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          height: fit-content;
        }
        .user-profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
        }
        .profile-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--accent-color);
          color: var(--accent-text);
          font-weight: 700;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .profile-meta h3 {
          font-size: 1.05rem;
          font-weight: 600;
        }
        .profile-meta span {
          font-size: 0.8rem;
          display: block;
        }
        .admin-tag {
          margin-top: 4px;
          font-size: 0.65rem;
          font-weight: 600;
        }
        
        .dashboard-nav-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dashboard-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          text-align: left;
          transition: var(--transition-fast);
        }
        .dashboard-nav-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .dashboard-nav-item.active {
          background-color: var(--accent-color);
          color: var(--accent-text);
        }
        .admin-nav-item {
          color: var(--accent-color);
          border: 1px dashed var(--accent-color);
        }
        .logout-btn {
          color: #c93b3b;
        }
        .logout-btn:hover {
          background-color: #f7e8e8;
          color: #c93b3b;
        }
        [data-theme="dark"] .logout-btn:hover {
          background-color: #2b1717;
        }

        /* Content block */
        .dashboard-content {
          min-height: 400px;
        }
        .dashboard-tab-panel h2 {
          font-size: 1.6rem;
          margin-bottom: 6px;
        }
        .mb-20 {
          margin-bottom: 20px;
        }
        .no-panel-content {
          padding: 60px 20px;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-secondary);
        }
        
        /* Order History List */
        .orders-history-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .order-history-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          overflow: hidden;
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          padding: 16px 20px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 16px;
        }
        .header-meta span {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .header-meta strong {
          font-size: 0.9rem;
        }
        .order-card-body {
          padding: 20px;
        }
        .order-items-mini-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        .order-mini-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .order-mini-item img {
          width: 44px;
          height: 52px;
          object-fit: cover;
          border-radius: 4px;
        }
        .order-card-actions {
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
          display: flex;
          justify-content: flex-end;
        }
        
        /* Addresses Grid */
        .panel-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .add-address-form-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .add-address-form-box h3 {
          font-size: 1.15rem;
          margin-bottom: 16px;
        }
        .addresses-grid-dashboard {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .addresses-grid-dashboard {
            grid-template-columns: 1fr;
          }
        }
        .address-card-dashboard {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px;
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .addr-card-header {
          display: flex;
          align-items: center;
        }
        .addr-card-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
        .addr-card-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-color);
          padding-top: 12px;
        }
        .btn-delete-addr {
          font-size: 0.8rem;
          color: #c93b3b;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .profile-form-mock {
          max-width: 500px;
        }
        .help-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
