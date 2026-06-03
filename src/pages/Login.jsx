import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock, Mail, Sparkles, LogIn } from 'lucide-react';

export const Login = () => {
  const { user, loginUser, signInWithGoogle } = useShop();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await loginUser(email, password);
    if (res.success) {
      if (res.user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(res.message || 'Invalid login credentials');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        // If OAuth returns a redirect URL it goes there, otherwise in mock sandbox it signs in immediately
        if (res.user) {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Google authentication failed.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during Google sign in.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper section-padding">
      <div className="container auth-container animate-scale-in">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p className="text-secondary">Sign in to manage orders, track delivery, and access saved addresses.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input-field"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-forgot-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input-field"
                />
              </div>
            </div>

            {errorMsg && <p className="auth-error-msg animate-fade-in">{errorMsg}</p>}

            <button type="submit" className="btn btn-primary w-full auth-submit-btn">
              <LogIn size={18} /> Sign In
            </button>
          </form>

          {/* OAuth Separator */}
          <div className="auth-separator">
            <span>or</span>
          </div>

          {/* Google login Button */}
          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={isGoogleLoading}
            className="btn btn-secondary w-full google-login-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          <div className="auth-footer text-center">
            <p>New to Aura Wear? <Link to="/register" className="auth-swap-link">Create an account</Link></p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-container {
          max-width: 480px;
          margin: 0 auto;
        }
        .auth-card {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          background-color: var(--bg-primary);
          padding: 40px;
          box-shadow: var(--shadow-md);
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 24px;
          }
        }
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-header h2 {
          font-size: 1.8rem;
          margin-bottom: 8px;
        }
        .auth-header p {
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .auth-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-secondary);
          transition: var(--transition-fast);
        }
        .auth-input-wrapper:focus-within {
          border-color: var(--border-focus);
          background-color: var(--bg-primary);
          box-shadow: 0 0 0 2px var(--accent-light);
        }
        .auth-input-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .auth-input-field {
          flex: 1;
          font-size: 0.95rem;
        }
        
        .label-forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .forgot-link {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-decoration: underline;
        }
        .forgot-link:hover {
          color: var(--accent-color);
        }
        
        .auth-error-msg {
          color: #c93b3b;
          font-size: 0.85rem;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .auth-submit-btn {
          margin-top: 10px;
        }

        .auth-separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .auth-separator::before, .auth-separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }
        .auth-separator span {
          padding: 0 10px;
        }

        .google-login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          font-weight: 500;
          transition: var(--transition-normal);
        }
        .google-login-btn:hover {
          background-color: var(--bg-secondary);
          transform: translateY(-2px);
        }
        
        .auth-footer {
          margin-top: 24px;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }
        .auth-swap-link {
          color: var(--accent-color);
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};