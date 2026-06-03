import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export const ForgotPassword = () => {
  const { sendPasswordResetEmail } = useShop();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (email.trim()) {
      setIsSubmitting(true);
      try {
        const res = await sendPasswordResetEmail(email);
        if (res.success) {
          setSubmitted(true);
        } else {
          setErrorMsg(res.message || 'Failed to send recovery link. Please try again.');
        }
      } catch (err) {
        setErrorMsg('An unexpected error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="auth-page-wrapper section-padding">
      <div className="container auth-container animate-scale-in">
        <div className="auth-card">
          <div className="back-to-login">
            <Link to="/login"><ArrowLeft size={16} /> Back to Sign In</Link>
          </div>

          <div className="auth-header">
            <h2>Recover Password</h2>
            <p className="text-secondary">Enter your registered email address and we'll send a password recovery mock verification link.</p>
          </div>

          {submitted ? (
            <div className="reset-success-box text-center animate-scale-in">
              <Mail size={40} className="success-mail-icon" />
              <h3>Check your Inbox</h3>
              <p className="text-secondary">We have sent a mock reset link to <strong>{email}</strong>. Use it to update your password profile.</p>
              <Link to="/reset-password" className="btn btn-primary btn-sm mt-12">Simulate Reset Action</Link>
            </div>
          ) : (
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

              {errorMsg && <p className="auth-error-msg animate-fade-in" style={{ color: '#c93b3b', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 500, textAlign: 'center' }}>{errorMsg}</p>}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full auth-submit-btn">
                {isSubmitting ? 'Sending...' : <><Send size={16} /> Send Recovery Link</>}
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
        .back-to-login {
          margin-bottom: 20px;
        }
        .back-to-login a {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .back-to-login a:hover {
          color: var(--text-primary);
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
        .success-mail-icon {
          color: var(--accent-color);
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};
