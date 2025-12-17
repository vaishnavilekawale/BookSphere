// ...existing code...
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const safeParse = (v) => {
    try { return JSON.parse(v); } catch { return null; }
  };

  const [user, setUser] = useState(() => safeParse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [token, user]);

  const extract = (resData) => {
    // support multiple response shapes
    if (!resData) return { token: null, user: null };
    const token = resData.token || resData.accessToken || resData?.data?.token || null;
    const user = resData.user || resData?.data?.user || (resData.user ?? resData) || null;
    return { token, user };
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: tk, user: u } = extract(res.data);
    if (!tk) throw new Error('No token returned from server');
    setToken(tk);
    setUser(u);
    return { token: tk, user: u };
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: tk, user: u } = extract(res.data);
    if (!tk) throw new Error('No token returned from server');
    setToken(tk);
    setUser(u);
    return { token: tk, user: u };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = ((user?.role || '').toString().toLowerCase() === 'admin');

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser, setToken, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
// ...existing code...

//  import React, { createContext, useState, useEffect } from 'react';
//  import api from '../api/axios';
//  export const AuthContext = createContext();
//  export const AuthProvider = ({ children }) => {
//  const [user, setUser] = useState(() =>
//  JSON.parse(localStorage.getItem('user')) || null);
//  const [token, setToken] = useState(() => localStorage.getItem('token') ||
//  null);
//  useEffect(() => {
//  if (token) {
//  localStorage.setItem('token', token);
//  } else localStorage.removeItem('token');
//  if (user) localStorage.setItem('user', JSON.stringify(user)); else
//  localStorage.removeItem('user');
 
// }, [token, user]);
//  const login = async (email, password) => {
//  const { data } = await api.post('/auth/login', { email, password });
//  setToken(data.token);
//  setUser(data.user);
//  };
//  const register = async (name, email, password) => {
//  const { data } = await api.post('/auth/register', { name, email,
//  password });
//  setToken(data.token);
//  setUser(data.user);
//  };
//  const logout = () => {
//  setToken(null);
//  setUser(null);
//  };
//  return <AuthContext.Provider value={{ user, token, login, register, logout }}
//  >{children}</AuthContext.Provider>;
//  };