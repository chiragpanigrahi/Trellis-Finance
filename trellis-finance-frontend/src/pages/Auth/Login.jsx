import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-bg">
        <div className="auth-grid" />
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">T</div>
          <div className="auth-logo-text">Trellis Finance</div>
        </div>

        <h1 className="auth-h1">Welcome back</h1>
        <p className="auth-sub">Sign in to your treasury dashboard</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="cfo@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button id="login-submit" type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-foot">
          No account?&nbsp;
          <Link to="/register" className="auth-link">Create one</Link>
        </p>

        {/* Demo hint */}
        <div style={{
          marginTop:20, padding:'12px 14px',
          background:'rgba(10,132,255,.07)', border:'1px solid rgba(10,132,255,.15)',
          borderRadius:8,
        }}>
          <div style={{ fontSize:11, color:'var(--blue)', fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:4 }}>
            Dev Hint
          </div>
          <div style={{ fontSize:12, color:'var(--text-2)' }}>
            Register a new account to auto-create your organization.
            Seed data (3 entities, 7 accounts, 21 transactions) is pre-loaded.
          </div>
        </div>
      </div>
    </div>
  );
}
