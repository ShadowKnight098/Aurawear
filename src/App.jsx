import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductComparison } from './components/ProductComparison';

// Storefront Pages
import { Homepage } from './pages/Homepage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrderTracking } from './pages/OrderTracking';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { NotFound } from './pages/NotFound';
import { StaticPolicies } from './pages/StaticPolicies';

// Customer Auth & Dashboard
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';

// Admin Portal Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCoupons } from './pages/admin/AdminCoupons';

// Route Guard for Admin Portal
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useShop();
  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Route Guard for Customer Dashboard
const ProtectedUserRoute = ({ children }) => {
  const { user } = useShop();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Unified layout manager
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Hide storefront header on admin pages */}
      {!isAdminRoute && <Navbar />}
      
      {/* Dynamic Main view with proper padding-top for sticky nav */}
      <main className="main-content-flow" style={{ flex: 1, paddingTop: isAdminRoute ? '0' : 'var(--nav-height)' }}>
        {children}
      </main>

      {/* Product comparison floating bar */}
      {!isAdminRoute && <ProductComparison />}

      {/* Hide storefront footer on admin pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Static informational tabs */}
          <Route path="/faq" element={<StaticPolicies />} />
          <Route path="/privacy-policy" element={<StaticPolicies />} />
          <Route path="/terms-conditions" element={<StaticPolicies />} />
          <Route path="/shipping-policy" element={<StaticPolicies />} />
          <Route path="/return-policy" element={<StaticPolicies />} />

          {/* User Auth & Panel */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={
            <ProtectedUserRoute>
              <Dashboard />
            </ProtectedUserRoute>
          } />

          {/* Admin Management System */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/coupons" element={
            <ProtectedAdminRoute>
              <AdminCoupons />
            </ProtectedAdminRoute>
          } />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
