import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../../store/authStore';
import { getTransactions, postTransaction, reverseTransaction } from '../../services/transactionService';
import apiClient from '../../services/apiClient';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateFormatter';

const CATEGORIES = ['Revenue','Payroll','Cloud Infrastructure','SaaS Subscriptions','Legal & Compliance','Marketing','Operations','Other'];

function TransactionModal({ accounts, onClose, onSuccess }) {
  const [form, setForm] = useState({ accountId:'', type:'CREDIT', amount:'', currency:'USD', category:'', description:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = f => e => setForm(v => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await postTransaction({
        ...form,
        amount: parseFloat(form.amount),
        currency: (accounts.find(a => a.id === form.accountId)?.currency) || form.currency,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post transaction');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Post Transaction</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="auth-error" style={{ marginBottom:16 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account</label>
            <select className="form-control" value={form.accountId} onChange={set('accountId')} required>
              <option value="">Select account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-control" value={form.type} onChange={set('type')}>
                <option value="CREDIT">Credit (Inflow)</option>
                <option value="DEBIT">Debit (Outflow)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input type="number" step="0.01" min="0.01" className="form-control" placeholder="10000.00" value={form.amount} onChange={set('amount')} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.category} onChange={set('category')}>
                <option value="">None</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input type="text" className="form-control" placeholder="e.g. Q2 SaaS renewal" value={form.description} onChange={set('description')} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Ledger() {
  const user     = useAuthStore(s => s.user);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]  = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load accounts
  useEffect(() => {
    if (!user?.organizationId) return;
    apiClient.get('/accounts', { params:{ organizationId: user.organizationId } })
      .then(r => {
        setAccounts(r.data || []);
        if (r.data?.length) setSelectedAccount(r.data[0].id);
      })
      .catch(() => {});
  }, [user?.organizationId]);

  const loadTx = useCallback(async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      const r = await getTransactions(selectedAccount, page, 20);
      setTransactions(r.data.content || []);
      setTotalPages(r.data.totalPages || 1);
    } catch (e) {
      setTransactions([]);
    } finally { setLoading(false); }
  }, [selectedAccount, page]);

  useEffect(() => { loadTx(); }, [loadTx]);

  const handleReverse = async id => {
    if (!confirm('Reverse this transaction? This cannot be undone.')) return;
    try {
      await reverseTransaction(id, 'Manual reversal via Ledger UI');
      loadTx();
    } catch (e) { alert(e.response?.data?.message || 'Reversal failed'); }
  };

  const currentAccount = accounts.find(a => a.id === selectedAccount);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ledger</h1>
          <p>Immutable transaction history — errors corrected by reversals only</p>
        </div>
        <button id="new-tx-btn" className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Post Transaction
        </button>
      </div>

      {/* Account Selector + Balance */}
      <div className="card mb-6" style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:220 }}>
          <div className="form-label" style={{ marginBottom:6 }}>Account</div>
          <select className="form-control" value={selectedAccount} onChange={e => { setSelectedAccount(e.target.value); setPage(0); }}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} — {a.currency}</option>)}
          </select>
        </div>
        {currentAccount && (
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.06em' }}>Current Balance</div>
            <div style={{ fontSize:28, fontWeight:900, color:'var(--teal)', fontVariantNumeric:'tabular-nums' }}>
              {formatCurrency(currentAccount.currentBalance, currentAccount.currency)}
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div className="card-title">Transactions {loading && <span className="spinner" style={{ marginLeft:8 }} />}</div>
          <button className="btn btn-ghost btn-sm" onClick={loadTx}>Refresh</button>
        </div>

        {transactions.length === 0 && !loading ? (
          <div className="empty">
            <div className="empty-icon">≡</div>
            <div className="empty-text">No transactions yet for this account.<br/>Use "Post Transaction" to add the first entry.</div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th style={{ textAlign:'right' }}>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontSize:12 }}>{formatDate(tx.transactionDate)}</td>
                      <td style={{ fontWeight:600, color:'var(--text)', maxWidth:240 }} className="trunc">{tx.description || '—'}</td>
                      <td style={{ fontSize:11, color:'var(--text-3)' }}>{tx.category || '—'}</td>
                      <td><span className={`badge badge-${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                      <td>
                        {tx.status === 'REVERSED'
                          ? <span style={{ fontSize:11, color:'var(--text-3)', textDecoration:'line-through' }}>Reversed</span>
                          : <span style={{ fontSize:11, color:'var(--green)' }}>Posted</span>}
                      </td>
                      <td className={tx.type === 'CREDIT' ? 'credit' : 'debit'} style={{ textAlign:'right' }}>
                        {tx.type === 'CREDIT' ? '+' : '−'}{formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td>
                        {tx.status === 'POSTED' && tx.type !== 'REVERSAL' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleReverse(tx.id)}>Reverse</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end', marginTop:16 }}>
                <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => setPage(p => p-1)}>Prev</button>
                <span style={{ fontSize:12, color:'var(--text-2)' }}>Page {page+1} of {totalPages}</span>
                <button className="btn btn-secondary btn-sm" disabled={page >= totalPages-1} onClick={() => setPage(p => p+1)}>Next</button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <TransactionModal
          accounts={accounts}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadTx(); }}
        />
      )}
    </div>
  );
}
