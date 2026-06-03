import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop, getProductCode } from '../context/ShopContext';
import { Check, AlertCircle, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

// Configurable WhatsApp Dealer Phone Number
// Standard phone number format (with country code, but no +, spaces, or leading zeros).
// E.g. '919999999999' for India.
const DEALER_WHATSAPP_NUMBER = import.meta.env.VITE_DEALER_WHATSAPP_NUMBER || '919999999999';

export const CheckoutPage = () => {
  const { 
    cart, getSubtotal, getShipping, discountAmount, 
    discountPercent, couponCode, placeOrder, addresses, user, addUserAddress 
  } = useShop();
  
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Form Fields State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [zipCode, setZipCode] = useState('500081');
  const [country, setCountry] = useState('India');
  
  const [isBillingSame, setIsBillingSame] = useState(true);
  const [billingName, setBillingName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState('WhatsApp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Auto-fill shipping details from default saved address and email from logged-in user if available
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
    const defAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defAddr) {
      setFullName(defAddr.fullName);
      setPhone(defAddr.phone);
      setStreetAddress(defAddr.streetAddress);
      setCity(defAddr.city);
      setState(defAddr.state);
      setZipCode(defAddr.zipCode);
      setCountry(defAddr.country);
    }
  }, [addresses, user]);

  if (cart.length === 0) return null;

  const subtotal = getSubtotal();
  const shipping = getShipping(subtotal);
  const total = subtotal - discountAmount + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Open blank tab immediately to bypass popup blocker
    const newTab = window.open('about:blank', '_blank');

    const deliveryDetails = {
      fullName,
      phone,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      email
    };

    const cartCopy = [...cart];

    try {
      const order = await placeOrder(deliveryDetails, 'WhatsApp');
      
      if (order && order.id) {
        // Save address to database profile if checked and user is logged in
        if (user && saveAddressToProfile) {
          const addressExists = addresses.some(addr => 
            addr.streetAddress.toLowerCase().trim() === streetAddress.toLowerCase().trim() &&
            addr.zipCode.trim() === zipCode.trim()
          );
          if (!addressExists) {
            await addUserAddress({
              id: `addr-${Date.now()}`,
              fullName,
              phone,
              streetAddress,
              city,
              state,
              zipCode,
              country,
              isDefault: addresses.length === 0
            });
          }
        }

        // Compile invoice text
        const itemsText = cartCopy.map(item => 
          `• *${item.name}* [Code: ${getProductCode(item.id)}] (Size: ${item.size}, Color: ${item.color})\n  Qty: ${item.quantity} x ₹${item.price} = ₹${item.price * item.quantity}`
        ).join('\n\n');

        const discountLine = discountAmount > 0 ? `\n• *Discount:* -₹${discountAmount} (${couponCode || 'Promo'})` : '';

        const text = `*AURA WEAR - ORDER INVOICE*\n` +
          `----------------------------------\n` +
          `*Order Reference:* ${order.id}\n` +
          `*Date:* ${new Date().toLocaleDateString()}\n\n` +
          `*Customer Details:*\n` +
          `• *Name:* ${fullName}\n` +
          `• *Phone:* ${phone}\n` +
          `• *Email:* ${email}\n\n` +
          `*Shipping Address:*\n` +
          `• *Street:* ${streetAddress}\n` +
          `• *City:* ${city}\n` +
          `• *State:* ${state}\n` +
          `• *Pincode:* ${zipCode}\n` +
          `• *Country:* ${country}\n\n` +
          `----------------------------------\n` +
          `*Items Ordered:*\n` +
          `${itemsText}\n\n` +
          `----------------------------------\n` +
          `*Payment Summary:*\n` +
          `• *Subtotal:* ₹${subtotal}` +
          `${discountLine}\n` +
          `• *Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}\n` +
          `• *Total Amount:* ₹${total}\n` +
          `----------------------------------\n` +
          `*Payment Method:* WhatsApp Checkout (Dealer Confirmation Pending)\n\n` +
          `Thank you for shopping with Aura Wear! Please confirm this order.`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${DEALER_WHATSAPP_NUMBER}&text=${encodedText}`;
        
        if (newTab) {
          newTab.location.href = whatsappUrl;
        } else {
          window.open(whatsappUrl, '_blank');
        }
        
        setIsSubmitting(false);
        navigate(`/order-success?id=${order.id}`);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (newTab) newTab.close();
      alert('There was a problem placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-wrapper section-padding">
      <div className="container">
        <h1 className="checkout-title">Secure Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* Form Side */}
          <div className="checkout-forms-area">
            {/* Step 1: Customer Contact Info */}
            <div className="checkout-step-card animate-fade-in">
              <div className="step-header">
                <span className="step-num">1</span>
                <h3>Customer Information</h3>
              </div>
              <div className="step-body">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className="form-input" 
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="checkout-step-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="step-header">
                <span className="step-num">2</span>
                <h3>Shipping Details</h3>
              </div>
              <div className="step-body">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rahul Sharma" 
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input 
                    type="text" 
                    required 
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House/Flat No, Apartment, Street Name" 
                    className="form-input" 
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      required 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input 
                      type="text" 
                      required 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={6}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="form-input" 
                    />
                  </div>
                </div>

                {/* Billing toggle */}
                <div className="billing-checkbox-row">
                  <input 
                    type="checkbox" 
                    id="billingSame"
                    checked={isBillingSame}
                    onChange={(e) => setIsBillingSame(e.target.checked)}
                  />
                  <label htmlFor="billingSame">Billing address is same as shipping address</label>
                </div>

                {user && (
                  <div className="billing-checkbox-row" style={{ marginTop: '12px' }}>
                    <input 
                      type="checkbox" 
                      id="saveAddress"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                    />
                    <label htmlFor="saveAddress">Save this address to my profile for future checkouts</label>
                  </div>
                )}

                {!isBillingSame && (
                  <div className="billing-extra-inputs animate-fade-in">
                    <h4 className="sub-step-title">Billing Details</h4>
                    <div className="form-group">
                      <label className="form-label">Billing Full Name</label>
                      <input 
                        type="text" 
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        placeholder="Name on bill" 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Billing Address</label>
                      <input 
                        type="text" 
                        value={billingStreet}
                        onChange={(e) => setBillingStreet(e.target.value)}
                        placeholder="Street details" 
                        className="form-input" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Payment Section */}
            <div className="checkout-step-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="step-header">
                <span className="step-num">3</span>
                <h3>Payment Confirmation</h3>
              </div>
              <div className="step-body">
                <div className="whatsapp-notice-box">
                  <div className="whatsapp-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.116-2.905-6.993-1.876-1.878-4.36-2.907-7.003-2.908-5.44 0-9.867 4.424-9.871 9.87.002 2.009.523 3.974 1.514 5.71l-.999 3.654 3.739-.981c1.558.85 3.238 1.3 4.841 1.3zm7.66-8.567c-.249-.124-1.472-.727-1.7-.81-.228-.083-.393-.124-.559.124-.166.249-.643.81-.788.975-.145.166-.29.187-.539.062-.25-.125-1.05-.387-2.001-1.235-.74-.66-1.239-1.475-1.384-1.724-.145-.25-.015-.385.11-.51.113-.112.25-.29.374-.435.125-.145.166-.249.25-.415.083-.166.042-.311-.02-.435-.063-.124-.559-1.349-.766-1.85-.202-.489-.407-.423-.559-.431-.145-.008-.311-.01-.477-.01-.166 0-.435.062-.663.311-.228.249-.87.85-.87 2.075 0 1.224.891 2.406.99 2.54.099.135 1.752 2.674 4.247 3.746.593.255 1.056.408 1.417.523.596.19 1.138.163 1.567.099.478-.073 1.472-.601 1.679-1.182.207-.581.207-1.079.145-1.182-.063-.103-.228-.166-.477-.29z"/>
                    </svg>
                  </div>
                  <div className="whatsapp-notice-text">
                    <h4>Direct WhatsApp Checkout</h4>
                    <p>
                      Your order will be securely recorded and compiled into a WhatsApp message. Once placed, you will be redirected to WhatsApp to share the details with our dealer for final shipping and delivery confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <aside className="checkout-summary-panel">
            <div className="summary-box">
              <h3>Your Order</h3>
              
              <div className="checkout-items-list">
                {cart.map(item => (
                  <div key={item.key} className="checkout-item-mini">
                    <img src={item.image} alt="" />
                    <div className="mini-item-info">
                      <h4>{item.name}</h4>
                      <span>Qty: {item.quantity} | Size: {item.size}</span>
                    </div>
                    <span className="mini-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row promo-discount-row">
                    <span>Discount ({discountPercent}%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                
                <div className="divider"></div>
                
                <div className="summary-row total-row">
                  <span>Total Cost</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Secure Trust indicators */}
              <div className="secure-badge whatsapp-secure-badge">
                <ShieldCheck size={18} />
                <span>Order Verified via WhatsApp Checkout</span>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary w-full place-order-btn"
              >
                {isSubmitting ? 'Redirecting to WhatsApp...' : <>Confirm & Send via WhatsApp <ArrowRight size={18} /></>}
              </button>
            </div>
          </aside>
        </form>
      </div>

      <style>{`
        .checkout-title {
          font-size: 2.2rem;
          margin-bottom: 32px;
          margin-top: 40px;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .checkout-forms-area {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .checkout-step-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .step-header {
          padding: 20px 24px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: var(--accent-color);
          color: var(--accent-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .step-body {
          padding: 24px;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1.2fr 1.2fr 1fr;
          gap: 16px;
        }
        @media (max-width: 576px) {
          .form-row-2, .form-row-3 {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
        
        .billing-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          margin-top: 8px;
          color: var(--text-secondary);
        }
        .billing-extra-inputs {
          margin-top: 20px;
          border-top: 1px dashed var(--border-color);
          padding-top: 20px;
        }
        .sub-step-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 16px;
        }

        /* WhatsApp Notice Styling */
        .whatsapp-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background-color: rgba(37, 211, 102, 0.08);
          border: 1px solid rgba(37, 211, 102, 0.20);
          border-radius: var(--radius-md);
        }
        [data-theme="dark"] .whatsapp-notice-box {
          background-color: rgba(37, 211, 102, 0.04);
          border-color: rgba(37, 211, 102, 0.15);
        }
        .whatsapp-icon-wrapper {
          color: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background-color: rgba(37, 211, 102, 0.12);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .whatsapp-notice-text h4 {
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .whatsapp-notice-text p {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.5;
        }
        .whatsapp-secure-badge {
          color: #25D366 !important;
          background-color: rgba(37, 211, 102, 0.08) !important;
        }
        [data-theme="dark"] .whatsapp-secure-badge {
          background-color: rgba(37, 211, 102, 0.04) !important;
        }

        /* Checkout summary */
        .checkout-summary-panel {
          position: sticky;
          top: calc(var(--nav-height) + 20px);
        }
        .checkout-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-right: 8px;
        }
        .checkout-item-mini {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .checkout-item-mini img {
          width: 48px;
          height: 58px;
          object-fit: cover;
          border-radius: 4px;
        }
        .mini-item-info {
          flex: 1;
        }
        .mini-item-info h4 {
          font-size: 0.85rem;
          font-weight: 500;
          line-height: 1.3;
        }
        .mini-item-info span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .mini-item-price {
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #248a52;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 8px;
          background-color: #e3f5eb;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
        }
        [data-theme="dark"] .secure-badge {
          background-color: #12291e;
        }
        .place-order-btn {
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
};
