import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useLoans } from '../hooks/useLoans';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/globalStyles';
import { TEXT_STYLES } from '../styles/typography';
import { formatCurrency } from '../utils/formatters';
import { APP_CONFIG } from '../constants/config';

const LoanRequestScreen = () => {
  const router = useRouter();
  const { requestLoan, calculateLoan } = useLoans();
  const { wallet } = useAuth();

  const [formData, setFormData] = useState({
    principalAmount: '',
    termDays: 7,
    purpose: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loanCalculation, setLoanCalculation] = useState(null);

  const termOptions = [
    { value: 7, label: '7 хоног' },
    { value: 14, label: '14 хоног' },
    { value: 21, label: '21 хоног' },
    { value: 30, label: '30 хоног' },
  ];

  const handleAmountChange = (value) => {
    // Зөвхөн тоо оруулах
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, principalAmount: numericValue }));
    
    // Тооцоо хийх
    if (numericValue && parseInt(numericValue) >= APP_CONFIG.MIN_LOAN_AMOUNT) {
      const calculation = calculateLoan(
        parseInt(numericValue),
        formData.termDays,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setLoanCalculation(calculation);
    } else {
      setLoanCalculation(null);
    }

    // Алдаа арилгах
    if (errors.principalAmount) {
      setErrors(prev => ({ ...prev, principalAmount: null }));
    }
  };

  const handleTermChange = (term) => {
    setFormData(prev => ({ ...prev, termDays: term }));
    
    // Тооцоо дахин хийх
    if (formData.principalAmount && parseInt(formData.principalAmount) >= APP_CONFIG.MIN_LOAN_AMOUNT) {
      const calculation = calculateLoan(
        parseInt(formData.principalAmount),
        term,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setLoanCalculation(calculation);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseInt(formData.principalAmount);

    if (!formData.principalAmount) {
      newErrors.principalAmount = 'Зээлийн дүн оруулна уу';
    } else if (amount < APP_CONFIG.MIN_LOAN_AMOUNT) {
      newErrors.principalAmount = `Хамгийн бага зээл ${formatCurrency(APP_CONFIG.MIN_LOAN_AMOUNT)}`;
    } else if (amount > APP_CONFIG.MAX_LOAN_AMOUNT) {
      newErrors.principalAmount = `Хамгийн их зээл ${formatCurrency(APP_CONFIG.MAX_LOAN_AMOUNT)}`;
    } else if (wallet && amount > wallet.availableCredit) {
      newErrors.principalAmount = `Таны зээлийн лимит: ${formatCurrency(wallet.availableCredit)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Хэтэвч баталгаажаагүй бол
    if (!wallet?.isVerified) {
      Alert.alert(
        'Хэтэвч баталгаажаагүй',
        'Зээл авахын тулд эхлээд хэтэвчээ баталгаажуулна уу.',
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

    Alert.alert(
      'Зээл авах',
      `Та ${formatCurrency(parseInt(formData.principalAmount))} зээл авах гэж байна. Нийт төлөх дүн: ${formatCurrency(loanCalculation?.totalAmount)}. Үргэлжлүүлэх үү?`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Илгээх',
          onPress: async () => {
            try {
              setLoading(true);
              
              await requestLoan({
                principalAmount: parseInt(formData.principalAmount),
                termDays: formData.termDays,
                purpose: formData.purpose || undefined,
              });

              Alert.alert(
                'Амжилттай',
                'Зээлийн хүсэлт амжилттай илгээлээ. Удахгүй хянагдана.',
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
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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

        {/* Wallet Info */}
        {wallet?.isVerified && (
          <Card style={styles.walletCard} padding="medium">
            <View style={styles.walletRow}>
              <Text style={styles.walletLabel}>Боломжит лимит:</Text>
              <Text style={styles.walletValue}>
                {formatCurrency(wallet.availableCredit)}
              </Text>
            </View>
          </Card>
        )}

        {/* Amount Input */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Зээлийн дүн</Text>
          
          <Input
            placeholder="0"
            value={formData.principalAmount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            error={errors.principalAmount}
            style={styles.amountInput}
            inputStyle={styles.amountInputText}
          />

          <Text style={styles.hintText}>
            Хамгийн багадаа: {formatCurrency(APP_CONFIG.MIN_LOAN_AMOUNT)}
          </Text>
        </Card>

        {/* Term Selection */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Зээлийн хугацаа</Text>
          
          <View style={styles.termOptions}>
            {termOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.termOption,
                  formData.termDays === option.value && styles.termOptionActive,
                ]}
                onPress={() => handleTermChange(option.value)}>
                <Text
                  style={[
                    styles.termOptionText,
                    formData.termDays === option.value && styles.termOptionTextActive,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Purpose */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Зориулалт (заавал биш)</Text>
          
          <Input
            placeholder="Жишээ: Бизнес хөрөнгө оруулалт"
            value={formData.purpose}
            onChangeText={(value) =>
              setFormData(prev => ({ ...prev, purpose: value }))
            }
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </Card>

        {/* Calculation */}
        {loanCalculation && (
          <Card style={styles.calculationCard} padding="large">
            <Text style={styles.calculationTitle}>Тооцоолол</Text>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Үндсэн дүн:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(loanCalculation.principalAmount)}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>
                Хүү ({APP_CONFIG.LOAN_INTEREST_RATE}%):
              </Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(loanCalculation.totalInterest)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabelBold}>Нийт төлөх:</Text>
              <Text style={styles.calculationValueBold}>
                {formatCurrency(loanCalculation.totalAmount)}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Хугацаа:</Text>
              <Text style={styles.calculationValue}>
                {formData.termDays} хоног
              </Text>
            </View>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          title="Зээл авах хүсэлт илгээх"
          onPress={handleSubmit}
          loading={loading}
          disabled={!loanCalculation}
          fullWidth
          style={styles.submitButton}
        />

        {/* Info */}
        <Card style={styles.infoCard} padding="medium">
          <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
          <Text style={styles.infoText}>
            • Зээлийн хүсэлт 24 цагийн дотор хянагдана{'\n'}
            • Батлагдсан зээл таны хэтэвчинд шууд орно{'\n'}
            • Хугацаандаа төлбөл зээлийн лимит нэмэгдэнэ
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
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
  walletCard: {
    backgroundColor: COLORS.primaryLight,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
  },
  walletValue: {
    ...TEXT_STYLES.h4,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  sectionTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  amountInput: {
    marginBottom: SPACING.xs,
  },
  amountInputText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  termOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  termOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  termOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  termOptionText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  termOptionTextActive: {
    color: COLORS.textWhite,
  },
  calculationCard: {
    backgroundColor: COLORS.backgroundGray,
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
    alignItems: 'center',
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
    marginVertical: SPACING.lg,
  },
  infoCard: {
    backgroundColor: COLORS.infoLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    marginBottom: SPACING.xl,
  },
  infoTitle: {
    ...TEXT_STYLES.bodyLarge,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default LoanRequestScreen;