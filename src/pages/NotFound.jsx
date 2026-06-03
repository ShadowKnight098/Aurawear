import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container section-padding text-center error-page-wrapper">
      <HelpCircle size={64} className="text-muted mb-20 error-icon" />
      <h1 className="error-code">404</h1>
      <h2 className="error-title">Page Not Found</h2>
      <p className="text-secondary mb-32 max-w-400">
        We couldn't locate the design page you're searching for. It may have been updated, or its URL changed.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Storefront
      </Link>

      <style>{`
        .error-page-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }
        .error-icon {
          color: var(--accent-color);
          margin-top: 40px;
        }
        .error-code {
          font-size: 5rem;
          line-height: 1;
          font-family: var(--font-display);
          color: var(--text-muted);
        }
        .error-title {
          font-size: 1.8rem;
          margin-bottom: 12px;
        }
        .max-w-400 {
          max-width: 400px;
          margin: 0 auto;
        }
        .mb-20 { margin-bottom: 20px; }
        .mb-32 { margin-bottom: 32px; }
      `}</style>
    </div>
  );
};
export default NotFound;
