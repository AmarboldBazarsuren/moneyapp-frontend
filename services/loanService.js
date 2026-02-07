import api from './api';

class LoanService {
  // Зээл авах хүсэлт
  async requestLoan(loanData) {
    try {
      return await api.post('/loans/request', loanData);
    } catch (error) {
      throw error;
    }
  }

  // Миний зээлүүд
  async getMyLoans(status = null, page = 1, limit = 20) {
    try {
      const params = { page, limit };
      if (status) {
        params.status = status;
      }
      return await api.get('/loans', params);
    } catch (error) {
      throw error;
    }
  }

  // Идэвхтэй зээлүүд
  async getActiveLoans() {
    try {
      return await api.get('/loans/active');
    } catch (error) {
      throw error;
    }
  }

  // Зээлийн дэлгэрэнгүй
  async getLoanDetail(loanId) {
    try {
      return await api.get(`/loans/${loanId}`);
    } catch (error) {
      throw error;
    }
  }

  // Зээл төлөх
  async repayLoan(loanId) {
    try {
      return await api.post(`/loans/${loanId}/repay`);
    } catch (error) {
      throw error;
    }
  }

  // Зээлийн тооцоо хийх (client side)
  calculateLoan(principalAmount, termDays, interestRate = 2.8) {
    const totalInterest = Math.round(principalAmount * (interestRate / 100));
    const totalAmount = principalAmount + totalInterest;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + termDays);
    
    return {
      principalAmount,
      interestRate,
      totalInterest,
      totalAmount,
      termDays,
      dueDate,
    };
  }
}

export default new LoanService();