import api from './axiosConfig';

export const createPayment = (payload) => api.post('/payments', payload);
export const getPayments = (bookingId) => api.get(`/payments/${bookingId}`);
