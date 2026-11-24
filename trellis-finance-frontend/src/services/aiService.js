import apiClient from './apiClient';
export const getInsights    = orgId => apiClient.get('/ai/insights',    { params:{ orgId } });
export const getInvestments = orgId => apiClient.get('/ai/investments', { params:{ orgId } });
