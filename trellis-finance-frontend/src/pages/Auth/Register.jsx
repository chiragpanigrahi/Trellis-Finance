import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CURRENCIES = ['USD','EUR','GBP','JPY','CHF','CAD','AUD','SGD'];

export default function Register() {
  const { register } = useAuth();
  const [form, setForm]   = useState({ fullName:'', email:'', password:'', organizationName:'', baseCurrency:'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.fields
        ? Object.values(err.response.data.fields || {}).join(', ')
        : 'Registration failed. Please try again.');
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

      <div className="auth-card" style={{ maxWidth:460 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">T</div>
          <div className="auth-logo-text">Trellis Finance</div>
        </div>

        <h1 className="auth-h1">Create your organization</h1>
        <p className="auth-sub">Set up the global treasury platform in seconds</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="reg-name" type="text" className="form-control" placeholder="Alex Chen" value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input id="reg-email" type="email" className="form-control" placeholder="cfo@company.com" value={form.email} onChange={set('email')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="reg-password" type="password" className="form-control" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input id="reg-org" type="text" className="form-control" placeholder="Trellis Global HQ" value={form.organizationName} onChange={set('organizationName')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Base Currency</label>
              <select id="reg-currency" className="form-control" value={form.baseCurrency} onChange={set('baseCurrency')}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button id="reg-submit" type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Organization'}
          </button>
        </form>

        <p className="auth-foot">
          Already have an account?&nbsp;
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
