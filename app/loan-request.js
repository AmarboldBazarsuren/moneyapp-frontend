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
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useLoans } from '../hooks/useLoans';
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
  const [loanCalculation, setLoanCalculation] = useState(null);

  const termOptions = [
    { value: 7, label: '7 хоног' },
    { value: 14, label: '14 хоног' },
    { value: 21, label: '21 хоног' },
    { value: 30, label: '30 хоног' },
  ];

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, principalAmount: numericValue }));
    
    if (errors.principalAmount) {
      setErrors(prev => ({ ...prev, principalAmount: null }));
    }

    if (numericValue && parseInt(numericValue) >= APP_CONFIG.MIN_LOAN_AMOUNT) {
      const calc = calculateLoan(
        parseInt(numericValue),
        formData.termDays,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setLoanCalculation(calc);
    } else {
      setLoanCalculation(null);
    }
  };

  const handleTermChange = (term) => {
    setFormData(prev => ({ ...prev, termDays: term }));
    
    if (formData.principalAmount && parseInt(formData.principalAmount) >= APP_CONFIG.MIN_LOAN_AMOUNT) {
      const calc = calculateLoan(
        parseInt(formData.principalAmount),
        term,
        APP_CONFIG.LOAN_INTEREST_RATE
      );
      setLoanCalculation(calc);
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

    if (!wallet?.isEmongolaVerified) {
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

    const amount = parseInt(formData.principalAmount);

    Alert.alert(
      'Зээл авах',
      `Та ${formatCurrency(amount)} зээл авах гэж байна. Нийт төлөх дүн: ${formatCurrency(loanCalculation?.totalAmount)}. Үргэлжлүүлэх үү?`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Илгээх',
          onPress: async () => {
            try {
              setLoading(true);
              
              await requestLoan({
                principalAmount: amount,
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
          <Text style={styles.headerTitle}>Зээл авах</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Wallet Info */}
          {wallet?.isEmongolaVerified && (
            <View style={styles.walletCard}>
              <LinearGradient
                colors={['#4ECDC4', '#38A3A5']}
                style={styles.walletGrad}>
                <View style={styles.walletRow}>
                  <Text style={styles.walletLabel}>💰 Боломжит лимит:</Text>
                  <Text style={styles.walletValue}>
                    {formatCurrency(wallet.availableCredit)}
                  </Text>
                </View>
              </LinearGradient>
            </View>
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
              <Text style={styles.calculationTitle}>📊 Тооцоолол</Text>

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
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!loanCalculation || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!loanCalculation || loading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={!loanCalculation || loading ? ['#CBD5E1', '#94A3B8'] : ['#FFD93D', '#FF8C42']}
              style={styles.submitGrad}>
              <Text style={styles.submitText}>
                {loading ? 'Илгээж байна...' : 'Зээл авах хүсэлт илгээх'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Info */}
          <Card style={styles.infoCard} padding="medium">
            <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
            <Text style={styles.infoText}>
              • Зээлийн хүсэлт 24 цагийн дотор хянагдана{'\n'}
              • Батлагдсан зээл таны хэтэвчинд шууд орно{'\n'}
              • Хугацаандаа төлбөл зээлийн лимит нэмэгдэнэ
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

  // Wallet Card
  walletCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  walletGrad: {
    padding: 20,
  },
  walletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
  walletValue: {
    fontSize: 20,
    fontWeight: '800',
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

  // Term Options
  termOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  termOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  termOptionActive: {
    borderColor: '#FF6B9D',
    backgroundColor: '#FFF5F7',
  },
  termOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  termOptionTextActive: {
    color: '#FF6B9D',
    fontWeight: '700',
  },

  // Calculation Card
  calculationCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#FFD93D',
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
    color: '#FF6B9D',
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
    shadowColor: '#FFD93D',
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
});

export default LoanRequestScreen;