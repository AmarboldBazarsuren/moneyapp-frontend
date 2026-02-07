import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import { validateRegistrationForm } from '../../utils/validators';

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    registerNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRegister = async () => {
    // Validate
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Нууц үг таарахгүй байна',
      }));
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      Alert.alert(
        'Амжилттай бүртгэгдлээ',
        'Та амжилттай бүртгүүллээ',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Бүртгэл амжилтгүй',
        error.message || 'Алдаа гарлаа. Дахин оролдоно уу.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Бүртгүүлэх</Text>
            <Text style={styles.subtitle}>
              Шинэ данс үүсгэх
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Овог"
              placeholder="Овог"
              value={formData.lastName}
              onChangeText={(value) => handleChange('lastName', value)}
              error={errors.lastName}
            />

            <Input
              label="Нэр"
              placeholder="Нэр"
              value={formData.firstName}
              onChangeText={(value) => handleChange('firstName', value)}
              error={errors.firstName}
            />

            <Input
              label="Регистрийн дугаар"
              placeholder="УБ12345678"
              value={formData.registerNumber}
              onChangeText={(value) => handleChange('registerNumber', value.toUpperCase())}
              maxLength={10}
              error={errors.registerNumber}
            />

            <Input
              label="Утасны дугаар"
              placeholder="88888888"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              keyboardType="phone-pad"
              maxLength={8}
              error={errors.phoneNumber}
            />

            <Input
              label="Имэйл (заавал биш)"
              placeholder="example@email.com"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              error={errors.email}
            />

            <Input
              label="Нууц үг"
              placeholder="Хамгийн багадаа 6 тэмдэгт"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              error={errors.password}
            />

            <Input
              label="Нууц үг давтах"
              placeholder="Нууц үгээ дахин оруулна уу"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button
              title="Бүртгүүлэх"
              onPress={handleRegister}
              loading={loading}
              fullWidth
              style={styles.registerButton}
            />
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Бүртгэлтэй юу? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Нэвтрэх</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  footerText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  linkText: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;