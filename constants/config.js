import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Компьютерийн IP хаяг - ЗААВАЛ ӨӨРЧЛӨХ!
const DEV_API_URL = Platform.select({
  web: 'http://localhost:5000/api',
  default: 'http://192.168.88.4:5000/api',  // ← ЭНЭ IP-г солих!!!
});

const ENV = {
  dev: {
    apiUrl: DEV_API_URL,
  },
  staging: {
    apiUrl: 'https://staging-api.moneyapp.mn/api',
  },
  prod: {
    apiUrl: 'https://api.moneyapp.mn/api',
  },
};

const getEnvVars = () => {
  if (__DEV__) {
    console.log('🔧 Development mode');
    console.log('📡 API URL:', ENV.dev.apiUrl);
    console.log('📱 Platform:', Platform.OS);
    return ENV.dev;
  } else if (Constants.expoConfig?.extra?.environment === 'staging') {
    return ENV.staging;
  } else {
    return ENV.prod;
  }
};

const environment = getEnvVars();

// API Configuration
export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  TIMEOUT: 30000,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'MoneyApp',
  VERSION: '1.0.0',
  LOAN_INTEREST_RATE: 2.8,
  EMONGOLA_VERIFICATION_FEE: 3000,  // ШИНЭ: E-Mongolia баталгаажуулалт
  MIN_LOAN_AMOUNT: 10000,
  MAX_LOAN_AMOUNT: 5000000,
  MIN_WITHDRAWAL_AMOUNT: 1000,      // ШИНЭ: Мөнгө татах хамгийн бага
  MIN_DEPOSIT_AMOUNT: 1000,         // ШИНЭ: Цэнэглэх хамгийн бага
  LOAN_TERMS: [7, 14, 21, 30],
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@moneyapp_token',
  USER_DATA: '@moneyapp_user',
  REMEMBER_ME: '@moneyapp_remember',
};

// Screen Names
export const SCREENS = {
  // Auth
  LOGIN: 'login',
  REGISTER: 'register',
  
  // Main Tabs
  HOME: 'home',
  LOANS: 'loans',
  WALLET: 'wallet',
  PROFILE: 'profile',
  
  // Loan Screens
  LOAN_REQUEST: 'loan-request',
  LOAN_DETAIL: 'loan-detail',
  
  // Wallet Screens
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  WITHDRAWAL_DETAIL: 'withdrawal-detail',
};