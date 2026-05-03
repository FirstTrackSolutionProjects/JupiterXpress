import React, { createContext, useState, useEffect, useContext } from 'react'; // Added useContext
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext(null); // Initialize with null

export const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token'),
    verified: false,
  });

  // Helper function to check token validity without modifying state directly
  const checkTokenValidity = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now(); // Returns true if valid, false if expired
    } catch (error) {
      // console.error("Token decoding failed or expired:", error); // Optional: for debugging
      return false;
    }
  };

  // Derived state for authentication status
  const isAuthenticated = checkTokenValidity(auth.token);

  const login = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    // Assuming token is valid here, decode to update auth state
    const decoded = jwtDecode(token); 
    setAuth({ username: decoded.business_name || decoded.name || username, token: token, verified: !!decoded.verified });
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setAuth({ username: null, token: null, verified: false });
  };

  useEffect(() => {
    // On initial mount, verify the stored token's validity
    const storedToken = localStorage.getItem('token');
    if (!checkTokenValidity(storedToken)) {
      logout(); // If invalid or expired, log out
    } else {
      // If valid, ensure auth state is populated from the token (e.g., username)
      const decoded = jwtDecode(storedToken);
      setAuth({ 
        username: decoded.business_name || decoded.name || localStorage.getItem('username'), 
        token: storedToken,
        verified: !!decoded.verified
      });
    }
  }, []); // Runs once on mount

  // The value provided to consumers of AuthContext
  const contextValue = { 
    ...auth, // Provides username, token
    isAuthenticated, // Provides the boolean status
    login, 
    logout, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
