import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import walletService from '../services/walletService';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/globalStyles';
import { TEXT_STYLES } from '../styles/typography';
import { formatCurrency } from '../utils/formatters';
import { APP_CONFIG } from '../constants/config';

const DepositScreen = () => {
  const router = useRouter();
  const { wallet, refreshUser } = useAuth();

  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Түгээмэл дүнгүүд
  const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000];

  const handleAmountChange = (value) => {
    // Зөвхөн тоо оруулах
    const numericValue = value.replace(/[^0-9]/g, '');
    setAmount(numericValue);

    // Алдаа арилгах
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: null }));
    }
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(String(quickAmount));
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const depositAmount = parseInt(amount);

    if (!amount) {
      newErrors.amount = 'Дүн оруулна уу';
    } else if (depositAmount < APP_CONFIG.MIN_DEPOSIT_AMOUNT) {
      newErrors.amount = `Хамгийн бага цэнэглэх дүн ${formatCurrency(APP_CONFIG.MIN_DEPOSIT_AMOUNT)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeposit = async () => {
    if (!validateForm()) {
      return;
    }

    const depositAmount = parseInt(amount);

    Alert.alert(
      'Хэтэвч цэнэглэх',
      `Та ${formatCurrency(depositAmount)} цэнэглэх гэж байна. QPay-р төлнө үү.`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Үргэлжлүүлэх',
          onPress: async () => {
            try {
              setLoading(true);

              const response = await walletService.requestDeposit(depositAmount);

              if (response.success) {
                Alert.alert(
                  'Амжилттай',
                  'Төлбөрийн хүсэлт үүслээ. QPay-р төлнө үү.',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        await refreshUser();
                        router.back();
                      },
                    },
                  ]
                );
              }
            } catch (error) {
              Alert.alert(
                'Алдаа',
                error.message || 'Хүсэлт илгээхэд алдаа гарлаа',
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
          <Text style={styles.headerTitle}>Хэтэвч цэнэглэх</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Одоогийн үлдэгдэл */}
        <Card style={styles.balanceCard} padding="large">
          <Text style={styles.balanceLabel}>Одоогийн үлдэгдэл</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(wallet?.balance || 0)}
          </Text>
        </Card>

        {/* Цэнэглэх дүн оруулах */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Цэнэглэх дүн</Text>

          <Input
            placeholder="0"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            error={errors.amount}
            style={styles.amountInput}
            inputStyle={styles.amountInputText}
          />

          <Text style={styles.hintText}>
            Хамгийн багадаа: {formatCurrency(APP_CONFIG.MIN_DEPOSIT_AMOUNT)}
          </Text>
        </Card>

        {/* Түгээмэл дүнгүүд */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Түгээмэл дүнгүүд</Text>

          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[
                  styles.quickAmountButton,
                  amount === String(quickAmount) && styles.quickAmountButtonActive,
                ]}
                onPress={() => handleQuickAmount(quickAmount)}>
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === String(quickAmount) && styles.quickAmountTextActive,
                  ]}>
                  {formatCurrency(quickAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Тооцоолол */}
        {amount && parseInt(amount) >= APP_CONFIG.MIN_DEPOSIT_AMOUNT && (
          <Card style={styles.calculationCard} padding="large">
            <Text style={styles.calculationTitle}>Тооцоолол</Text>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Цэнэглэх дүн:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(parseInt(amount))}
              </Text>
            </View>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Одоогийн үлдэгдэл:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(wallet?.balance || 0)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabelBold}>Шинэ үлдэгдэл:</Text>
              <Text style={styles.calculationValueBold}>
                {formatCurrency((wallet?.balance || 0) + parseInt(amount))}
              </Text>
            </View>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          title="QPay-р төлөх"
          onPress={handleDeposit}
          loading={loading}
          disabled={!amount || parseInt(amount) < APP_CONFIG.MIN_DEPOSIT_AMOUNT}
          fullWidth
          style={styles.submitButton}
        />

        {/* Info */}
        <Card style={styles.infoCard} padding="medium">
          <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
          <Text style={styles.infoText}>
            • QPay-р төлсний дараа 1-5 минутын дотор орно{'\n'}
            • Төлбөрийн баримт хадгалж авна уу{'\n'}
            • Асуудал гарвал 7711-1234 дугаарт холбогдоно уу
          </Text>
        </Card>

        {/* Payment Methods */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Төлбөрийн хэрэгсэл</Text>

          <View style={styles.paymentMethod}>
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodEmoji}>💳</Text>
            </View>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>QPay</Text>
              <Text style={styles.paymentMethodDesc}>
                Бүх банкны апп дээр ажиллана
              </Text>
            </View>
            <View style={styles.paymentMethodBadge}>
              <Text style={styles.paymentMethodBadgeText}>Ашиглана</Text>
            </View>
          </View>

          <View style={[styles.paymentMethod, styles.paymentMethodDisabled]}>
            <View style={styles.paymentMethodIcon}>
              <Text style={styles.paymentMethodEmoji}>🏦</Text>
            </View>
            <View style={styles.paymentMethodInfo}>
              <Text style={[styles.paymentMethodName, styles.disabledText]}>
                Дансаар шилжүүлэх
              </Text>
              <Text style={[styles.paymentMethodDesc, styles.disabledText]}>
                Удахгүй нээгдэнэ
              </Text>
            </View>
          </View>
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
  balanceCard: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  balanceLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    ...TEXT_STYLES.h1,
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
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  quickAmountButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  quickAmountText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  quickAmountTextActive: {
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
    lineHeight: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginBottom: SPACING.sm,
  },
  paymentMethodDisabled: {
    opacity: 0.5,
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  paymentMethodEmoji: {
    fontSize: 24,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  paymentMethodDesc: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  disabledText: {
    opacity: 0.6,
  },
  paymentMethodBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  paymentMethodBadgeText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
});

export default DepositScreen;