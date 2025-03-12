import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import jwt_decode from 'jwt-decode';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();

  // Check for token on initial load
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Verify token hasn't expired
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            logout();
          } else {
            // Valid token, set user
            setUser(decodedToken.data);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          logout();
        }
      }
      setLoading(false);
    };
    
    checkToken();
  }, []);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem('auth_token', token);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    // Reset Apollo cache
    client.resetStore();
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  // Check if user is admin of a specific cabin
  const isAdminOfCabin = (cabinId) => {
    if (!user || !user.cabins) return false;
    return user.cabins.some(
      cabin => cabin.cabinId === cabinId && cabin.role === 'ADMIN'
    );
  };

  // Check if user is member of a specific cabin
  const isMemberOfCabin = (cabinId) => {
    if (!user || !user.cabins) return false;
    return user.cabins.some(
      cabin => cabin.cabinId === cabinId
    );
  };

  // Check if user is global admin
  const isGlobalAdmin = () => {
    return user && user.role === 'GLOBAL_ADMIN';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAdminOfCabin,
    isMemberOfCabin,
    isGlobalAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
