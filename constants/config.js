// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? 'http://localhost:5000/api'  // Development
    : 'https://your-production-api.com/api',  // Production
  TIMEOUT: 30000,
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'MoneyApp',
  VERSION: '1.0.0',
  LOAN_INTEREST_RATE: 2.8,
  WALLET_VERIFICATION_FEE: 3000,
  MIN_LOAN_AMOUNT: 10000,
  MAX_LOAN_AMOUNT: 5000000,
  LOAN_TERMS: [7, 14, 21, 30], // хоногоор
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
  LOAN_REPAY: 'loan-repay',
};