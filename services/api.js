import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

class AuthService {
  // Бүртгүүлэх
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

  // Нэвтрэх
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

  // Гарах
  async logout() {
    try {
      await api.removeToken();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // Хэрэглэгчийн мэдээлэл авах
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

  // Нууц үг солих
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

  // Хэрэглэгчийн мэдээлэл хадгалах
  async saveUserData(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error('User data хадгалахад алдаа:', error);
    }
  }

  // Хэрэглэгчийн мэдээлэл авах
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('User data уншихад алдаа:', error);
      return null;
    }
  }

  // Нэвтэрсэн эсэхийг шалгах
  async isAuthenticated() {
    const token = await api.getToken();
    return !!token;
  }
}

export default new AuthService();