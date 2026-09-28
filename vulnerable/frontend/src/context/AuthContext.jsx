import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getMe();
          setUser(data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginSuccess = async (token) => {
    localStorage.setItem('token', token);
    const data = await getMe();
    setUser(data);
    return data.role;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
