import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/auth/me');
      setUser(res.data);
      if (res.data.selected_path) {
        localStorage.setItem('careerPath', res.data.selected_path);
      }
      if (res.data.resume_uploaded) {
        localStorage.setItem('resumeUploaded', 'true');
      }
    } catch (err) {
      console.error("Auth fetch error:", err);
      // Only logout if it's a clear authentication failure (401 or 403)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:8000/api/auth/login', { email, password });
    setToken(res.data.access_token);
    localStorage.setItem('token', res.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
    await fetchUser();
    return true;
  };

  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:8000/api/auth/register', { name, email, password });
    setToken(res.data.access_token);
    localStorage.setItem('token', res.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
    await fetchUser();
    return true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('careerPath');
    localStorage.removeItem('resumeUploaded');
    delete axios.defaults.headers.common['Authorization'];
  };
  
  const updateUser = (data) => setUser({ ...user, ...data });

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
