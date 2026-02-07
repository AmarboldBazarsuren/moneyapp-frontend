import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // App эхлэхэд хэрэглэгч нэвтэрсэн эсэхийг шалгах
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const response = await authService.getMe();
        if (response.success) {
          setUser(response.data.user);
          setWallet(response.data.wallet);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth шалгахад алдаа:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phoneNumber, password) => {
    try {
      const response = await authService.login(phoneNumber, password);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Хэтэвчийн мэдээлэл авах
        await refreshUser();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Хэтэвчийн мэдээлэл авах
        await refreshUser();
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setWallet(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout алдаа:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.data.user);
        setWallet(response.data.wallet);
      }
    } catch (error) {
      console.error('User refresh алдаа:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const updateWallet = (walletData) => {
    setWallet(prev => ({ ...prev, ...walletData }));
  };

  const value = {
    user,
    wallet,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    updateWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;