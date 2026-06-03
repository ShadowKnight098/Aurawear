import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock, CheckCircle2 } from 'lucide-react';

export const ResetPassword = () => {
  const { updatePassword } = useShop();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updatePassword(password);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Failed to update password. Link may be expired.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper section-padding">
      <div className="container auth-container animate-scale-in">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Set New Password</h2>
            <p className="text-secondary">Please enter your new password coordinates below.</p>
          </div>

          {submitted ? (
            <div className="reset-success-box text-center animate-scale-in">
              <CheckCircle2 size={40} className="success-check-icon" />
              <h3>Password Reset Done</h3>
              <p className="text-secondary">Your password has been simulated and updated successfully. You can now login.</p>
              <Link to="/login" className="btn btn-primary btn-sm mt-12">Login Now</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">New Password</label>
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

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-input-field"
                  />
                </div>
              </div>

              {errorMsg && <p className="auth-error-msg animate-fade-in">{errorMsg}</p>}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full auth-submit-btn">
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}
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
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-header h2 {
          font-size: 1.8rem;
          margin-bottom: 8px;
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
        .reset-success-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .success-check-icon {
          color: #248a52;
          margin-bottom: 12px;
        }
        .auth-error-msg {
          color: #c93b3b;
          font-size: 0.85rem;
          margin-bottom: 16px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
