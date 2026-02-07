/**
 * Мөнгөний дүнг форматлах
 * @param {number} amount - Мөнгөний дүн
 * @returns {string} - Форматлагдсан мөнгө (жишээ: "100,000₮")
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0₮';
  return `${amount.toLocaleString('en-US')}₮`;
};

/**
 * Утасны дугаар форматлах
 * @param {string} phoneNumber - Утасны дугаар
 * @returns {string} - Форматлагдсан утасны дугаар (жишээ: "9988-7766")
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phoneNumber;
};

/**
 * Огноог форматлах
 * @param {string|Date} date - Огноо
 * @param {boolean} includeTime - Цаг харуулах эсэх
 * @returns {string} - Форматлагдсан огноо
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  return `${year}-${month}-${day}`;
};

/**
 * Огноо монгол хэлээр форматлах
 * @param {string|Date} date - Огноо
 * @returns {string} - Монгол огноо (жишээ: "2026-02-07")
 */
export const formatDateMongolian = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
};

/**
 * Харьцангуй огноо (жишээ: "2 цагийн өмнө")
 * @param {string|Date} date - Огноо
 * @returns {string} - Харьцангуй огноо
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Дөнгөж сая';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} минутын өмнө`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} цагийн өмнө`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} өдрийн өмнө`;
  } else {
    return formatDateMongolian(date);
  }
};

/**
 * Зээлийн статусын өнгө авах
 * @param {string} status - Зээлийн статус
 * @returns {string} - Өнгө
 */
export const getLoanStatusColor = (status) => {
  const colors = {
    pending: '#FF9800',   // Шар
    active: '#2196F3',    // Цэнхэр
    repaid: '#4CAF50',    // Ногоон
    overdue: '#F44336',   // Улаан
    cancelled: '#9E9E9E', // Саарал
  };
  return colors[status] || '#9E9E9E';
};

/**
 * Зээлийн статус монгол хэлээр
 * @param {string} status - Зээлийн статус
 * @returns {string} - Монгол статус
 */
export const getLoanStatusText = (status) => {
  const texts = {
    pending: 'Хүлээгдэж байна',
    active: 'Идэвхтэй',
    repaid: 'Төлөгдсөн',
    overdue: 'Хугацаа хэтэрсэн',
    cancelled: 'Цуцлагдсан',
  };
  return texts[status] || status;
};

/**
 * Гүйлгээний төрөл монгол хэлээр - ШИНЭЧИЛСЭН
 * @param {string} type - Гүйлгээний төрөл
 * @returns {string} - Монгол төрөл
 */
export const getTransactionTypeText = (type) => {
  const texts = {
    emongola_verification: 'E-Mongolia баталгаажуулалт',
    deposit: 'Хэтэвч цэнэглэлт',
    loan_disbursement: 'Зээл олголт',
    loan_repayment: 'Зээл төлөлт',
    withdrawal: 'Мөнгө татсан',
    penalty: 'Алданги',
  };
  return texts[type] || type;
};

/**
 * Мөнгө татах хүсэлтийн статусын өнгө
 * @param {string} status - Withdrawal статус
 * @returns {string} - Өнгө
 */
export const getWithdrawalStatusColor = (status) => {
  const colors = {
    pending: '#FF9800',    // Шар
    approved: '#2196F3',   // Цэнхэр
    completed: '#4CAF50',  // Ногоон
    rejected: '#F44336',   // Улаан
    cancelled: '#9E9E9E',  // Саарал
  };
  return colors[status] || '#9E9E9E';
};

/**
 * Мөнгө татах хүсэлтийн статус монгол хэлээр
 * @param {string} status - Withdrawal статус
 * @returns {string} - Монгол статус
 */
export const getWithdrawalStatusText = (status) => {
  const texts = {
    pending: 'Хүлээгдэж байна',
    approved: 'Зөвшөөрөгдсөн',
    completed: 'Дууссан',
    rejected: 'Татгалзсан',
    cancelled: 'Цуцлагдсан',
  };
  return texts[status] || status;
};

/**
 * Хувцас огноо (өдрийн тоо)
 * @param {number} days - Өдрийн тоо
 * @returns {string} - Текст
 */
export const formatDaysText = (days) => {
  if (days === 1) return '1 өдөр';
  return `${days} хоног`;
};

/**
 * Хувь форматлах
 * @param {number} percent - Хувь
 * @returns {string} - Форматлагдсан хувь
 */
export const formatPercent = (percent) => {
  return `${percent}%`;
};

/**
 * Дансны дугаар нуух (4 орон харуулах)
 * @param {string} accountNumber - Дансны дугаар
 * @returns {string} - Нуусан дугаар
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const cleaned = accountNumber.replace(/\s/g, '');
  if (cleaned.length <= 4) return accountNumber;
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  return `${masked}${lastFour}`;
};

/**
 * Банкны нэр богино болгох
 * @param {string} bankName - Банкны нэр
 * @returns {string} - Богино нэр
 */
export const formatBankName = (bankName) => {
  const shortNames = {
    'Хаан банк': 'Хаан',
    'Төрийн банк': 'ТБ',
    'Голомт банк': 'Голомт',
    'Худалдаа хөгжлийн банк': 'ХХБ',
    'Капитрон банк': 'Капитрон',
    'Ариг банк': 'Ариг',
    'Богд банк': 'Богд',
    'Чингис хаан банк': 'Чингис',
  };
  return shortNames[bankName] || bankName;
};