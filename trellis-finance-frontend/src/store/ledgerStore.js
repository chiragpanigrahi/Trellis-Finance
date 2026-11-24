import { create } from 'zustand';
import { getConsolidatedBalance, getLedgerSummary } from '../services/ledgerService';

const useLedgerStore = create((set, get) => ({
  consolidated: null,
  summary:      null,
  loading:      false,
  error:        null,

  fetchConsolidated: async orgId => {
    set({ loading: true, error: null });
    try {
      const [c, s] = await Promise.all([
        getConsolidatedBalance(orgId),
        getLedgerSummary(orgId),
      ]);
      set({ consolidated: c.data, summary: s.data, loading: false });
    } catch (e) {
      set({ loading: false, error: e.response?.data?.message || 'Fetch failed' });
    }
  },
}));

export default useLedgerStore;
