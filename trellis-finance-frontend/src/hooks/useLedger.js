import { useEffect } from 'react';
import useAuthStore   from '../store/authStore';
import useLedgerStore from '../store/ledgerStore';

export function useLedger() {
  const user               = useAuthStore(s => s.user);
  const { consolidated, summary, loading, error, fetchConsolidated } = useLedgerStore();

  useEffect(() => {
    if (!user?.organizationId) return;
    fetchConsolidated(user.organizationId);
    const id = setInterval(() => fetchConsolidated(user.organizationId), 30_000);
    return () => clearInterval(id);
  }, [user?.organizationId]);

  return {
    consolidated, summary, loading, error,
    refresh: () => fetchConsolidated(user?.organizationId),
  };
}
