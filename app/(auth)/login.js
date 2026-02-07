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
import { validateLoginForm } from '../../utils/validators';

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = async () => {
    // Validate
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await login(formData.phoneNumber, formData.password);
      
      // Navigation автоматаар явагдана (AuthContext-с)
    } catch (error) {
      Alert.alert(
        'Нэвтрэх амжилтгүй',
        error.message || 'Утасны дугаар эсвэл нууц үг буруу байна',
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
            <Text style={styles.title}>Нэвтрэх</Text>
            <Text style={styles.subtitle}>
              MoneyApp-д тавтай морил
            </Text>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>💰</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Утасны дугаар"
              placeholder="88888888"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              keyboardType="phone-pad"
              maxLength={8}
              error={errors.phoneNumber}
              leftIcon={<Text style={styles.iconText}>📱</Text>}
            />

            <Input
              label="Нууц үг"
              placeholder="Нууц үгээ оруулна уу"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              error={errors.password}
              leftIcon={<Text style={styles.iconText}>🔒</Text>}
            />

            <Button
              title="Нэвтрэх"
              onPress={handleLogin}
              loading={loading}
              fullWidth
              style={styles.loginButton}
            />
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Бүртгэл үүсгээгүй юу? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.linkText}>Бүртгүүлэх</Text>
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
    marginTop: SPACING.xl,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 50,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  iconText: {
    fontSize: 20,
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
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

export default LoginScreen;