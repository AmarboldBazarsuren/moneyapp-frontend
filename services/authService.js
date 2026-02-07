import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

class AuthService {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.success && response.data.token) {
        await api.setToken(response.data.token);
        await this.saveUserData(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(phoneNumber, password) {
    try {
      const response = await api.post('/auth/login', {
        phoneNumber,
        password,
      });
      
      if (response.success && response.data.token) {
        await api.setToken(response.data.token);
        await this.saveUserData(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await api.removeToken();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.success) {
        await this.saveUserData(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      return await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  // ===== ШИНЭ: Профайл засварлах =====
  
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/update-profile', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async lockProfile() {
    try {
      const response = await api.post('/auth/lock-profile');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ===== ADMIN =====
  
  async adminUnlockProfile(userId) {
    try {
      const response = await api.put(`/auth/admin/unlock-profile/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async adminUpdateBankAccount(userId, bankAccountNumber) {
    try {
      const response = await api.put(`/auth/admin/update-bank-account/${userId}`, {
        bankAccountNumber
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async saveUserData(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('User data хадгалахад алдаа:', error);
    }
  }

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('User data уншихад алдаа:', error);
      return null;
    }
  }

  async isAuthenticated() {
    const token = await api.getToken();
    return !!token;
  }
}

export default new AuthService();