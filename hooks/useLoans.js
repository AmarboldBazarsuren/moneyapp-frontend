import { useState, useEffect, useCallback } from 'react';
import loanService from '../services/loanService';
import { useAuth } from './useAuth';

export const useLoans = () => {
  const { isAuthenticated, refreshUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Зээлүүд авах
  const loadLoans = useCallback(async (status = null, pageNum = 1, refresh = false) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loanService.getMyLoans(status, pageNum, 20);
      
      if (response.success) {
        const newLoans = response.data.loans;
        
        if (refresh) {
          setLoans(newLoans);
        } else {
          setLoans(prev => [...prev, ...newLoans]);
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

  // Идэвхтэй зээлүүд авах
  const loadActiveLoans = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loanService.getActiveLoans();
      
      if (response.success) {
        setActiveLoans(response.data.loans);
      }
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Зээл авах хүсэлт
  const requestLoan = useCallback(async (loanData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loanService.requestLoan(loanData);
      
      if (response.success) {
        await loadLoans(null, 1, true);
        await loadActiveLoans();
        await refreshUser();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadLoans, loadActiveLoans, refreshUser]);

  // Зээл төлөх
  const repayLoan = useCallback(async (loanId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loanService.repayLoan(loanId);
      
      if (response.success) {
        await loadLoans(null, 1, true);
        await loadActiveLoans();
        await refreshUser();
      }
      
      return response;
    } catch (err) {
      setError(err.message || 'Алдаа гарлаа');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadLoans, loadActiveLoans, refreshUser]);

  // Дараагийн хуудас
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadLoans(null, page + 1, false);
    }
  }, [isLoading, hasMore, page, loadLoans]);

  // Refresh
  const refresh = useCallback(async () => {
    await loadLoans(null, 1, true);
    await loadActiveLoans();
  }, [loadLoans, loadActiveLoans]);

  // Анхны ачаалал
  useEffect(() => {
    if (isAuthenticated) {
      loadLoans(null, 1, true);
      loadActiveLoans();
    }
  }, [isAuthenticated]);

  return {
    loans,
    activeLoans,
    isLoading,
    error,
    hasMore,
    loadLoans,
    loadActiveLoans,
    requestLoan,
    repayLoan,
    loadMore,
    refresh,
    calculateLoan: loanService.calculateLoan,
  };
};

export default useLoans;