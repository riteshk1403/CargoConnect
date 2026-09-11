import api from './axiosConfig';

export const createBooking = (payload) => api.post('/bookings', payload);
export const getBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getBookingsByShipper = (shipperId) => api.get(`/bookings/shipper/${shipperId}`);
export const getBookingsByDriver = (driverId) => api.get(`/bookings/driver/${driverId}`);
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status?status=${status}`);
export const assignDriver = (id, driverId) => api.put(`/bookings/${id}/assign-driver/${driverId}`);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
