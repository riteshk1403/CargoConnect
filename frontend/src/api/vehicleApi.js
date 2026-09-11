import api from './axiosConfig';

export const createVehicle = (payload) => api.post('/vehicles', payload);
export const getVehicles = () => api.get('/vehicles');
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const updateVehicle = (id, payload) => api.put(`/vehicles/${id}`, payload);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
