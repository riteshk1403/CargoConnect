import api from './axiosConfig';

export const createDriver = (payload) => api.post('/drivers', payload);
export const getDrivers = () => api.get('/drivers');
export const getDriverById = (id) => api.get(`/drivers/${id}`);
export const updateDriver = (id, payload) => api.put(`/drivers/${id}`, payload);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);
