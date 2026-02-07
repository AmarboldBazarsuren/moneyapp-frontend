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

  // Хэтэвч баталгаажуулах
  async verifyWallet() {
    try {
      return await api.post('/wallet/verify');
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