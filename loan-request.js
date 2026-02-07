import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useLoans } from '../hooks/useLoans';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/globalStyles';
import { TEXT_STYLES } from '../styles/typography';
import { formatCurrency } from '../utils/formatters';
import { APP_CONFIG } from '../constants/config';

const LoanRequestScreen = () => {
  const router = useRouter();
  const { wallet } = useAuth();
  const { requestLoan, calculateLoan } = useLoans();

  const [formData, setFormData] = useState({
    principalAmount: '',
    termDays: 7,
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState(null);

  const termOptions = APP_CONFIG.LOAN_TERMS.map(days => ({
    value: days,
    label: `${days} хоног`,
  }));

  const handleAmountChange = (value) => {
    // Remove non-numeric characters
    const cleanValue = value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, principalAmount: cleanValue });
    
    if (errors.principalAmount) {
      setErrors({ ...errors, principalAmount: null });
    }

    // Calculate loan if amount is valid
    if (cleanValue && parseInt(cleanValue) >= APP_CONFIG.MIN_LOAN_AMOUNT) {
      const calc = calculateLoan(
        parseInt(cleanValue),
        formData.termDays,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setCalculation(calc);
    } else {
      setCalculation(null);
    }
  };

  const handleTermChange = (days) => {
    setFormData({ ...formData, termDays: days });

    // Recalculate if amount exists
    if (formData.principalAmount) {
      const calc = calculateLoan(
        parseInt(formData.principalAmount),
        days,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setCalculation(calc);
    }
  };

  const handleSubmit = async () => {
    // Validate
    const newErrors = {};
    const amount = parseInt(formData.principalAmount);

    if (!formData.principalAmount) {
      newErrors.principalAmount = 'Зээлийн дүн оруулна уу';
    } else if (amount < APP_CONFIG.MIN_LOAN_AMOUNT) {
      newErrors.principalAmount = `Хамгийн бага зээл ${formatCurrency(APP_CONFIG.MIN_LOAN_AMOUNT)}`;
    } else if (amount > APP_CONFIG.MAX_LOAN_AMOUNT) {
      newErrors.principalAmount = `Хамгийн их зээл ${formatCurrency(APP_CONFIG.MAX_LOAN_AMOUNT)}`;
    }

    if (!wallet?.isVerified) {
      Alert.alert(
        'Анхааруулга',
        'Зээл авахын тулд хэтэвчээ баталгаажуулна уу',
        [
          { text: 'Цуцлах', style: 'cancel' },
          {
            text: 'Баталгаажуулах',
            onPress: () => router.push('/(tabs)/wallet'),
          },
        ]
      );
      return;
    }

    if (amount > (wallet?.availableCredit || 0)) {
      newErrors.principalAmount = `Боломжит зээл: ${formatCurrency(wallet?.availableCredit || 0)}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await requestLoan({
        principalAmount: amount,
        termDays: formData.termDays,
        purpose: formData.purpose,
      });

      Alert.alert(
        'Амжилттай',
        'Зээлийн хүсэлт амжилттай илгээгдлээ',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Алдаа',
        error.message || 'Зээлийн хүсэлт илгээхэд алдаа гарлаа',
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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Button
              title="← Буцах"
              onPress={() => router.back()}
              variant="outline"
              size="small"
            />
            <Text style={styles.headerTitle}>Зээл авах</Text>
            <View style={{ width: 70 }} />
          </View>

          {/* Available Credit */}
          <Card style={styles.creditCard} padding="medium">
            <Text style={styles.creditLabel}>Боломжит зээл</Text>
            <Text style={styles.creditAmount}>
              {formatCurrency(wallet?.availableCredit || 0)}
            </Text>
          </Card>

          {/* Form */}
          <Card padding="large">
            <Text style={styles.formTitle}>Зээлийн мэдээлэл</Text>

            <Input
              label="Зээлийн дүн (₮)"
              placeholder="Хэдэн төгрөг авах вэ?"
              value={formData.principalAmount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              error={errors.principalAmount}
            />

            {/* Term Selection */}
            <View style={styles.termContainer}>
              <Text style={styles.termLabel}>Хугацаа</Text>
              <View style={styles.termButtons}>
                {termOptions.map((option) => (
                  <Button
                    key={option.value}
                    title={option.label}
                    onPress={() => handleTermChange(option.value)}
                    variant={
                      formData.termDays === option.value ? 'primary' : 'outline'
                    }
                    size="small"
                    style={styles.termButton}
                  />
                ))}
              </View>
            </View>

            <Input
              label="Зориулалт (заавал биш)"
              placeholder="Зээлийн зориулалт"
              value={formData.purpose}
              onChangeText={(value) =>
                setFormData({ ...formData, purpose: value })
              }
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </Card>

          {/* Calculation */}
          {calculation && (
            <Card style={styles.calculationCard} padding="large">
              <Text style={styles.calculationTitle}>Зээлийн тооцоо</Text>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>Үндсэн дүн:</Text>
                <Text style={styles.calculationValue}>
                  {formatCurrency(calculation.principalAmount)}
                </Text>
              </View>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>
                  Хүү ({calculation.interestRate}%):
                </Text>
                <Text style={styles.calculationValue}>
                  {formatCurrency(calculation.totalInterest)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabelBold}>Нийт төлөх:</Text>
                <Text style={styles.calculationValueBold}>
                  {formatCurrency(calculation.totalAmount)}
                </Text>
              </View>

              <View style={styles.calculationRow}>
                <Text style={styles.calculationLabel}>Хугацаа:</Text>
                <Text style={styles.calculationValue}>
                  {calculation.termDays} хоног
                </Text>
              </View>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            title="Зээл авах хүсэлт илгээх"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            disabled={!calculation}
            style={styles.submitButton}
          />

          {/* Info */}
          <Card style={styles.infoCard} padding="medium">
            <Text style={styles.infoTitle}>ℹ️ Анхааруулга</Text>
            <Text style={styles.infoText}>
              • Зээлийн хүү: {APP_CONFIG.LOAN_INTEREST_RATE}%{'\n'}
              • Хугацаа хэтэрсэн тохиолдолд өдөр тутамд 1% алданги нэмэгдэнэ{'\n'}
              • Зээл батлагдсаны дараа таны хэтэвчинд орно
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  creditCard: {
    backgroundColor: COLORS.success,
    marginBottom: SPACING.lg,
  },
  creditLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  creditAmount: {
    ...TEXT_STYLES.h2,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  formTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  termContainer: {
    marginBottom: SPACING.md,
  },
  termLabel: {
    ...TEXT_STYLES.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  termButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  termButton: {
    flex: 1,
    minWidth: '22%',
  },
  calculationCard: {
    backgroundColor: COLORS.backgroundGray,
    marginBottom: SPACING.lg,
  },
  calculationTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  calculationLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  calculationValue: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  calculationLabelBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  calculationValueBold: {
    ...TEXT_STYLES.h4,
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  submitButton: {
    marginBottom: SPACING.lg,
  },
  infoCard: {
    backgroundColor: COLORS.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    ...TEXT_STYLES.bodyLarge,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});

export default LoanRequestScreen;