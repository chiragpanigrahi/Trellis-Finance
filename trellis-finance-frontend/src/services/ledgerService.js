import apiClient from './apiClient';
export const getConsolidatedBalance = orgId => apiClient.get('/ledger/consolidated', { params:{ orgId } });
export const getLedgerSummary       = orgId => apiClient.get('/ledger/summary',      { params:{ orgId } });
