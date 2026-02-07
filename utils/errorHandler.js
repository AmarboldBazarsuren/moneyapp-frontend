import { Alert } from 'react-native';

class ErrorHandler {
  handle(error, title = 'Алдаа гарлаа') {
    let message = 'Алдаа гарлаа. Дахин оролдоно уу.';

    if (error.message) {
      message = error.message;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Log error for debugging
    console.error('Error:', error);

    // Show alert
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  handleNetworkError() {
    Alert.alert(
      'Холболтын алдаа',
      'Интернет холболтоо шалгана уу',
      [{ text: 'OK' }]
    );
  }

  handleAuthError() {
    Alert.alert(
      'Нэвтрэх шаардлагатай',
      'Та дахин нэвтэрнэ үү',
      [{ text: 'OK' }]
    );
  }

  handleValidationError(errors) {
    if (typeof errors === 'object') {
      const firstError = Object.values(errors)[0];
      this.handle({ message: firstError });
    } else {
      this.handle({ message: errors });
    }
  }
}

export default new ErrorHandler();