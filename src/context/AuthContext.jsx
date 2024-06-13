import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token'),
  });

  const login = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setAuth({ username, token });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setAuth({ username: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
