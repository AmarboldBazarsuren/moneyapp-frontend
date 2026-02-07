import api from './api';

class WalletService {
  // Хэтэвчийн мэдээлэл авах
  async getWallet() {
    try {
      return await api.get('/wallet');
    } catch (error) {
      throw error;
    }
  }

  // E-Mongolia баталгаажуулах хүсэлт
  async verifyEmongola() {
    try {
      return await api.post('/wallet/verify-emongola');
    } catch (error) {
      throw error;
    }
  }

  // Хэтэвч цэнэглэх хүсэлт
  async requestDeposit(amount) {
    try {
      return await api.post('/wallet/deposit', { amount });
    } catch (error) {
      throw error;
    }
  }

  // Мөнгө татах хүсэлт
  async requestWithdrawal(withdrawalData) {
    try {
      return await api.post('/wallet/withdraw', withdrawalData);
    } catch (error) {
      throw error;
    }
  }

  // Миний мөнгө татах хүсэлтүүд
  async getMyWithdrawals(status = null, page = 1, limit = 20) {
    try {
      const params = { page, limit };
      if (status) {
        params.status = status;
      }
      return await api.get('/wallet/withdrawals', params);
    } catch (error) {
      throw error;
    }
  }

  // Гүйлгээний түүх авах
  async getTransactions(page = 1, limit = 20) {
    try {
      return await api.get('/wallet/transactions', { page, limit });
    } catch (error) {
      throw error;
    }
  }

  // Гүйлгээний дэлгэрэнгүй
  async getTransactionDetail(transactionId) {
    try {
      return await api.get(`/wallet/transactions/${transactionId}`);
    } catch (error) {
      throw error;
    }
  }
}

export default new WalletService();