/**
 * Утасны дугаар шалгах
 * @param {string} phoneNumber - Утасны дугаар
 * @returns {boolean} - Зөв эсэх
 */
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{8}$/;
  return phoneRegex.test(phoneNumber?.replace(/\D/g, ''));
};

/**
 * Нууц үг шалгах
 * @param {string} password - Нууц үг
 * @returns {object} - Шалгалтын үр дүн
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Нууц үг оруулна уу');
  }
  
  if (password && password.length < 6) {
    errors.push('Нууц үг хамгийн багадаа 6 тэмдэгт байна');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Регистрийн дугаар шалгах
 * @param {string} registerNumber - Регистрийн дугаар
 * @returns {boolean} - Зөв эсэх
 */
export const validateRegisterNumber = (registerNumber) => {
  const registerRegex = /^[А-ЯӨҮ]{2}[0-9]{8}$/;
  return registerRegex.test(registerNumber);
};

/**
 * Имэйл хаяг шалгах
 * @param {string} email - Имэйл хаяг
 * @returns {boolean} - Зөв эсэх
 */
export const validateEmail = (email) => {
  if (!email) return true; // Optional field
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Нэр шалгах
 * @param {string} name - Нэр
 * @returns {boolean} - Зөв эсэх
 */
export const validateName = (name) => {
  return name && name.trim().length > 0 && name.length <= 50;
};

/**
 * Зээлийн дүн шалгах
 * @param {number} amount - Зээлийн дүн
 * @param {number} min - Хамгийн бага
 * @param {number} max - Хамгийн их
 * @returns {object} - Шалгалтын үр дүн
 */
export const validateLoanAmount = (amount, min = 10000, max = 5000000) => {
  const errors = [];
  
  if (!amount || amount <= 0) {
    errors.push('Дүн оруулна уу');
  }
  
  if (amount < min) {
    errors.push(`Хамгийн бага зээл ${min.toLocaleString()}₮`);
  }
  
  if (amount > max) {
    errors.push(`Хамгийн их зээл ${max.toLocaleString()}₮`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Бүртгэлийн form шалгах
 * @param {object} data - Form өгөгдөл
 * @returns {object} - Шалгалтын үр дүн
 */
export const validateRegistrationForm = (data) => {
  const errors = {};
  
  if (!validatePhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Зөв утасны дугаар оруулна уу (8 орон)';
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }
  
  if (!validateName(data.firstName)) {
    errors.firstName = 'Нэр оруулна уу';
  }
  
  if (!validateName(data.lastName)) {
    errors.lastName = 'Овог оруулна уу';
  }
  
  if (!validateRegisterNumber(data.registerNumber)) {
    errors.registerNumber = 'Зөв регистрийн дугаар оруулна уу (жишээ: УБ12345678)';
  }
  
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Зөв имэйл хаяг оруулна уу';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Нэвтрэх form шалгах
 * @param {object} data - Form өгөгдөл
 * @returns {object} - Шалгалтын үр дүн
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!validatePhoneNumber(data.phoneNumber)) {
    errors.phoneNumber = 'Зөв утасны дугаар оруулна уу';
  }
  
  if (!data.password) {
    errors.password = 'Нууц үг оруулна уу';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};