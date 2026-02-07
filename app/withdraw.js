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
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import walletService from '../services/walletService';
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F7FA', '#ECF0F3']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Мөнгө татах</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Одоогийн үлдэгдэл */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={['#6BCF7F', '#4CAF50']}
              style={styles.balanceGrad}>
              <Text style={styles.balanceLabel}>Татах боломжтой</Text>
              <Text style={styles.balanceAmount}>
                {formatCurrency(wallet?.balance || 0)}
              </Text>
            </LinearGradient>
          </View>

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
              <Text style={styles.calculationTitle}>📊 Тооцоолол</Text>

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
          <TouchableOpacity
            style={[
              styles.submitButton,
              (loading || !formData.amount || !formData.bankName || !formData.bankAccountNumber || !formData.accountName) && styles.submitButtonDisabled
            ]}
            onPress={handleWithdraw}
            disabled={loading || !formData.amount || !formData.bankName || !formData.bankAccountNumber || !formData.accountName}
            activeOpacity={0.8}>
            <LinearGradient
              colors={loading ? ['#CBD5E1', '#94A3B8'] : ['#6BCF7F', '#4CAF50']}
              style={styles.submitGrad}>
              <Text style={styles.submitText}>
                {loading ? 'Илгээж байна...' : 'Хүсэлт илгээх'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

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

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },

  // Scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Balance Card
  balanceCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceGrad: {
    padding: 24,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },

  // Amount Input
  amountInput: {
    marginBottom: 8,
  },
  amountInputText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1A1A2E',
  },
  hintText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  // Banks Grid
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bankButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  bankButtonActive: {
    borderColor: '#6BCF7F',
    backgroundColor: '#F0FDF4',
  },
  bankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  bankTextActive: {
    color: '#6BCF7F',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    marginTop: 8,
  },

  // Calculation Card
  calculationCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#6BCF7F',
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculationLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  calculationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  calculationLabelBold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  calculationValueBold: {
    fontSize: 20,
    fontWeight: '800',
    color: '#6BCF7F',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },

  // Submit Button
  submitButton: {
    marginVertical: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6BCF7F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitGrad: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#5DADE2',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  // Warning Card
  warningCard: {
    backgroundColor: '#FFF5F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD93D',
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
});

export default WithdrawScreen;