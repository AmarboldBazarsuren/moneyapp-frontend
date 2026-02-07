import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.token = null;
  }

  // Token авах
  async getToken() {
    if (this.token) return this.token;
    
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      this.token = token;
      return token;
    } catch (error) {
      console.error('Token авахад алдаа:', error);
      return null;
    }
  }

  // Token хадгалах
  async setToken(token) {
    try {
      this.token = token;
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Token хадгалахад алдаа:', error);
    }
  }

  // Token устгах
  async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Token устгахад алдаа:', error);
    }
  }

  // Headers үүсгэх
  async getHeaders(customHeaders = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // HTTP Request хийх
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders(options.headers);

    const config = {
      method: options.method || 'GET',
      headers,
      ...options,
    };

    // Body байвал JSON болгох
    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Response шалгах
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Алдаа шалгах
      if (!response.ok) {
        // 401 Unauthorized - Token дууссан эсвэл буруу
        if (response.status === 401) {
          await this.removeToken();
        }

        throw {
          status: response.status,
          message: data.message || 'Алдаа гарлаа',
          data,
        };
      }

      return data;
    } catch (error) {
      // Timeout эсвэл Abort
      if (error.name === 'AbortError') {
        throw {
          message: 'Хүсэлт хэт удаан байна. Дахин оролдоно уу.',
        };
      }

      // Network алдаа
      if (error.message === 'Network request failed') {
        throw {
          message: 'Интернет холболтоо шалгана уу',
        };
      }

      // Бусад алдаа
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body,
    });
  }

  // PUT request
  async put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // PATCH request
  async patch(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body,
    });
  }
}

export default new ApiService();