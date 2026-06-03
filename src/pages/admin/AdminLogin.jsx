import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { Lock, Mail, Settings, ShieldCheck } from 'lucide-react';

export const AdminLogin = () => {
  const { user, loginUser } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@aurawear.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await loginUser(email, password);
    if (res.success && res.user.isAdmin) {
      navigate('/admin');
    } else {
      setErrorMsg('Unauthorized access attempts. Invalid admin credentials.');
    }
  };

  return (
    <div className="auth-page-wrapper section-padding">
      <div className="container auth-container animate-scale-in">
        <div className="auth-card admin-auth-card">
          <div className="admin-icon-top">
            <ShieldCheck size={40} />
          </div>
          
          <div className="auth-header text-center">
            <h2>Admin Control Portal</h2>
            <p className="text-secondary">Access is restricted to authorized managers. Pre-filled credentials below for testing.</p>
          </div>

          <form onSubmit={handleAdminSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input-field"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-forgot-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>Forgot Password?</Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input-field"
                />
              </div>
            </div>

            {errorMsg && <p className="auth-error-msg animate-fade-in">{errorMsg}</p>}

            <button type="submit" className="btn btn-primary w-full admin-submit-btn">
              Authenticate Admin
            </button>
          </form>
          
          <div className="auth-footer text-center">
            <Link to="/login" className="auth-swap-link">Standard Customer Sign In</Link>
          </div>
        </div>
      </div>

      <style>{`
        .admin-auth-card {
          border: 1.5px solid var(--accent-color) !important;
          background-color: var(--bg-secondary) !important;
        }
        .admin-icon-top {
          display: flex;
          justify-content: center;
          color: var(--accent-color);
          margin-bottom: 12px;
        }
        .admin-submit-btn {
          background-color: var(--text-primary);
          color: var(--bg-primary);
        }
        .admin-submit-btn:hover {
          background-color: var(--accent-color);
          color: var(--accent-text);
        }
      `}</style>
    </div>
  );
};
