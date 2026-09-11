import api from './axiosConfig';

export const registerUser = (payload) => api.post('/users/register', payload);
export const loginUser = (payload) => api.post('/users/login', payload);
export const getUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
