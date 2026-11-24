import apiClient from './apiClient';
export const getTransactions   = (accountId, page=0, size=20) => apiClient.get('/transactions', { params:{accountId,page,size} });
export const postTransaction   = data                         => apiClient.post('/transactions', data);
export const reverseTransaction= (id, reason)                 => apiClient.post(`/transactions/${id}/reverse`, { reason });
