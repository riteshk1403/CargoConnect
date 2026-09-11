import api from './axiosConfig';

export const trackBooking = (bookingNumber) => api.get(`/tracking/${bookingNumber}`);
