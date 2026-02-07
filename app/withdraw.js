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

const WithdrawScreen = () => {
  const router = useRouter();
  const { wallet, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    bankAccountNumber: '',
    accountName: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Монголын томоохон банкууд
  const banks = [
    'Хаан банк',
    'Төрийн банк',
    'Голомт банк',
    'Худалдаа хөгжлийн банк',
    'Капитрон банк',
    'Ариг банк',
    'Богд банк',
    'Чингис хаан банк',
    'Бусад',
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Алдаа арилгах
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleChange('amount', numericValue);
  };

  const handleBankSelect = (bank) => {
    handleChange('bankName', bank);
  };

  const validateForm = () => {
    const newErrors = {};
    const withdrawAmount = parseInt(formData.amount);

    if (!formData.amount) {
      newErrors.amount = 'Дүн оруулна уу';
    } else if (withdrawAmount < APP_CONFIG.MIN_WITHDRAWAL_AMOUNT) {
      newErrors.amount = `Хамгийн бага татах дүн ${formatCurrency(APP_CONFIG.MIN_WITHDRAWAL_AMOUNT)}`;
    } else if (withdrawAmount > wallet?.balance) {
      newErrors.amount = `Хэтэвчний үлдэгдэл хүрэлцэхгүй. Боломжит: ${formatCurrency(wallet?.balance)}`;
    }

    if (!formData.bankName) {
      newErrors.bankName = 'Банкны нэр сонгоно уу';
    }

    if (!formData.bankAccountNumber) {
      newErrors.bankAccountNumber = 'Дансны дугаар оруулна уу';
    } else if (formData.bankAccountNumber.length < 6) {
      newErrors.bankAccountNumber = 'Дансны дугаар хэт богино байна';
    }

    if (!formData.accountName) {
      newErrors.accountName = 'Дансны эзэмшигчийн нэр оруулна уу';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdraw = async () => {
    if (!validateForm()) {
      return;
    }

    const withdrawAmount = parseInt(formData.amount);

    Alert.alert(
      'Мөнгө татах',
      `Та ${formatCurrency(withdrawAmount)} татах гэж байна.\n\nБанк: ${formData.bankName}\nДанс: ${formData.bankAccountNumber}\nЭзэмшигч: ${formData.accountName}\n\nХүсэлт илгээх үү?`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Илгээх',
          onPress: async () => {
            try {
              setLoading(true);

              const response = await walletService.requestWithdrawal({
                amount: withdrawAmount,
                bankName: formData.bankName,
                bankAccountNumber: formData.bankAccountNumber,
                accountName: formData.accountName,
                notes: formData.notes || undefined,
              });

              if (response.success) {
                Alert.alert(
                  'Амжилттай',
                  'Мөнгө татах хүсэлт илгээлээ. Operator баталгаажуулсны дараа таны дансанд орно.',
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
          <Text style={styles.headerTitle}>Мөнгө татах</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Одоогийн үлдэгдэл */}
        <Card style={styles.balanceCard} padding="large">
          <Text style={styles.balanceLabel}>Татах боломжтой</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(wallet?.balance || 0)}
          </Text>
        </Card>

        {/* Татах дүн оруулах */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Татах дүн</Text>

          <Input
            placeholder="0"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            error={errors.amount}
            style={styles.amountInput}
            inputStyle={styles.amountInputText}
          />

          <Text style={styles.hintText}>
            Хамгийн багадаа: {formatCurrency(APP_CONFIG.MIN_WITHDRAWAL_AMOUNT)}
          </Text>
        </Card>

        {/* Банк сонгох */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Банк сонгох</Text>

          <View style={styles.banksGrid}>
            {banks.map((bank) => (
              <TouchableOpacity
                key={bank}
                style={[
                  styles.bankButton,
                  formData.bankName === bank && styles.bankButtonActive,
                ]}
                onPress={() => handleBankSelect(bank)}>
                <Text
                  style={[
                    styles.bankText,
                    formData.bankName === bank && styles.bankTextActive,
                  ]}>
                  {bank}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {errors.bankName && (
            <Text style={styles.errorText}>{errors.bankName}</Text>
          )}
        </Card>

        {/* Дансны мэдээлэл */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Дансны мэдээлэл</Text>

          <Input
            label="Дансны дугаар"
            placeholder="1234567890"
            value={formData.bankAccountNumber}
            onChangeText={(value) => handleChange('bankAccountNumber', value)}
            keyboardType="numeric"
            error={errors.bankAccountNumber}
          />

          <Input
            label="Дансны эзэмшигчийн нэр"
            placeholder="Овог Нэр"
            value={formData.accountName}
            onChangeText={(value) => handleChange('accountName', value)}
            error={errors.accountName}
          />

          <Input
            label="Тэмдэглэл (заавал биш)"
            placeholder="Тэмдэглэл бичих..."
            value={formData.notes}
            onChangeText={(value) => handleChange('notes', value)}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </Card>

        {/* Тооцоолол */}
        {formData.amount && parseInt(formData.amount) >= APP_CONFIG.MIN_WITHDRAWAL_AMOUNT && (
          <Card style={styles.calculationCard} padding="large">
            <Text style={styles.calculationTitle}>Тооцоолол</Text>

            <View style={styles.calculationRow}>
              <Text style={styles.calculationLabel}>Татах дүн:</Text>
              <Text style={styles.calculationValue}>
                {formatCurrency(parseInt(formData.amount))}
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
              <Text style={styles.calculationLabelBold}>Үлдэх үлдэгдэл:</Text>
              <Text style={styles.calculationValueBold}>
                {formatCurrency((wallet?.balance || 0) - parseInt(formData.amount))}
              </Text>
            </View>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          title="Хүсэлт илгээх"
          onPress={handleWithdraw}
          loading={loading}
          disabled={!formData.amount || !formData.bankName || !formData.bankAccountNumber || !formData.accountName}
          fullWidth
          style={styles.submitButton}
        />

        {/* Info */}
        <Card style={styles.infoCard} padding="medium">
          <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
          <Text style={styles.infoText}>
            • Хүсэлт operator баталгаажуулна{'\n'}
            • Батлагдсаны дараа 1-3 ажлын өдөрт мөнгө орно{'\n'}
            • Буруу данс оруулбал мөнгө буцаахад хэцүү{'\n'}
            • Дансны дугаараа анхааралтай шалгана уу
          </Text>
        </Card>

        {/* Warning */}
        <Card style={styles.warningCard} padding="medium">
          <Text style={styles.warningTitle}>⚠️ Анхааруулга</Text>
          <Text style={styles.warningText}>
            Дансны мэдээлэл буруу оруулсан тохиолдолд мөнгө алдагдах эрсдэлтэй. 
            Дансны дугаар, эзэмшигчийн нэрээ анхааралтай шалгана уу.
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
  balanceCard: {
    backgroundColor: COLORS.success,
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
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  bankButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  bankButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  bankText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  bankTextActive: {
    color: COLORS.textWhite,
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
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
    color: COLORS.success,
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
    marginBottom: SPACING.md,
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
  warningCard: {
    backgroundColor: COLORS.warningLight,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.xl,
  },
  warningTitle: {
    ...TEXT_STYLES.bodyLarge,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    color: COLORS.textPrimary,
  },
  warningText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
});

export default WithdrawScreen;