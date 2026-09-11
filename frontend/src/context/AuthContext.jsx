import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: identifier.includes('@') ? identifier.trim() : undefined,
        username: !identifier.includes('@') ? identifier.trim() : undefined,
        password: password
      });

      const { token, ...userData } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      throw { message: errorMsg, isUnverified: error.response?.status === 401 && errorMsg.toLowerCase().includes('verify') };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      console.warn('Server logout notice:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
