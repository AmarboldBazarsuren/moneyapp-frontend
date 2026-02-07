import { useState, useEffect, useCallback } from 'react';
import walletService from '../services/walletService';
import { useAuth } from './useAuth';

export const useWallet = () => {
  const { wallet, updateWallet, isAuthenticated, refreshUser } = useAuth(); // ✅ refreshUser нэмэх
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Хэтэвчийн мэдээлэл дахин авах
  const refreshWallet = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await walletService.getWallet();
      
      if (response.success) {
        updateWallet(response.data);
      }
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, updateWallet]);

  // Гүйлгээний түүх авах
  const loadTransactions = useCallback(async (pageNum = 1, refresh = false) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await walletService.getTransactions(pageNum, 20);
      
      if (response.success) {
        const newTransactions = response.data.transactions;
        
        if (refresh) {
          setTransactions(newTransactions);
        } else {
          setTransactions(prev => [...prev, ...newTransactions]);
        }
        
        setHasMore(response.data.pagination.page < response.data.pagination.pages);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Дараагийн хуудас ачаалах
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadTransactions(page + 1, false);
    }
  }, [isLoading, hasMore, page, loadTransactions]);

  // Refresh хийх
  const refresh = useCallback(async () => {
    await refreshWallet();
    await loadTransactions(1, true);
  }, [refreshWallet, loadTransactions]);

  // ✅ ШИНЭ: E-Mongolia баталгаажуулах
  const verifyEmongola = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await walletService.verifyEmongola();
      
      if (response.success) {
        await refreshUser(); // User болон wallet мэдээлэл шинэчлэх
        await refreshWallet();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser, refreshWallet]);

  // Анхны ачаалал
  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions(1, true);
    }
  }, [isAuthenticated, loadTransactions]);

  return {
    wallet,
    transactions,
    isLoading,
    error,
    hasMore,
    refreshWallet,
    loadTransactions,
    loadMore,
    refresh,
    verifyEmongola, 
  };
};

export default useWallet;