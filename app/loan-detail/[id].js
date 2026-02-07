import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import loanService from '../../services/loanService';
import { useLoans } from '../../hooks/useLoans';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getLoanStatusColor,
  getLoanStatusText,
} from '../../utils/formatters';

const LoanDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { repayLoan } = useLoans();
  const { wallet } = useAuth();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadLoanDetail();
  }, [id]);

  const loadLoanDetail = async () => {
    try {
      setLoading(true);
      const response = await loanService.getLoanDetail(id);
      
      if (response.success) {
        setLoan(response.data);
      }
    } catch (error) {
      Alert.alert(
        'Алдаа',
        error.message || 'Зээлийн дэлгэрэнгүй авахад алдаа гарлаа',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRepayLoan = () => {
    const totalDue = (loan?.remainingAmount || 0) + (loan?.penaltyAmount || 0);
    
    Alert.alert(
      'Зээл төлөх',
      `Та ${formatCurrency(totalDue)} төлөх гэж байна. Үргэлжлүүлэх үү?`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Төлөх',
          onPress: async () => {
            if ((wallet?.balance || 0) < totalDue) {
              Alert.alert(
                'Хэтэвчний үлдэгдэл хүрэлцэхгүй',
                `Таны хэтэвчний үлдэгдэл: ${formatCurrency(wallet?.balance || 0)}\nШаардлагатай: ${formatCurrency(totalDue)}`,
                [{ text: 'OK' }]
              );
              return;
            }

            try {
              setPaying(true);
              await repayLoan(id);
              
              Alert.alert(
                'Амжилттай',
                'Зээл амжилттай төлөгдлөө',
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
                error.message || 'Зээл төлөхөд алдаа гарлаа',
                [{ text: 'OK' }]
              );
            } finally {
              setPaying(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!loan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Зээл олдсонгүй</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getLoanStatusColor(loan.status);
  const statusText = getLoanStatusText(loan.status);
  const canRepay = loan.status === 'active' || loan.status === 'overdue';
  const totalDue = (loan.remainingAmount || 0) + (loan.penaltyAmount || 0);

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
          <Text style={styles.headerTitle}>Зээлийн дэлгэрэнгүй</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Status Card */}
        <Card style={[styles.statusCard, { backgroundColor: statusColor }]} padding="large">
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
        </Card>

        {/* Loan Details */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Зээлийн мэдээлэл</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Үндсэн дүн:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(loan.principalAmount)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Хүү ({loan.interestRate}%):</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(loan.totalInterest)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabelBold}>Нийт дүн:</Text>
            <Text style={styles.detailValueBold}>
              {formatCurrency(loan.totalAmount)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Хугацаа:</Text>
            <Text style={styles.detailValue}>{loan.termDays} хоног</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Огноо:</Text>
            <Text style={styles.detailValue}>
              {formatDate(loan.createdAt)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дуусах огноо:</Text>
            <Text style={styles.detailValue}>
              {formatDate(loan.dueDate)}
            </Text>
          </View>

          {loan.purpose && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Зориулалт:</Text>
              </View>
              <Text style={styles.purposeText}>{loan.purpose}</Text>
            </>
          )}
        </Card>

        {/* Payment Info */}
        {canRepay && (
          <Card style={styles.paymentCard} padding="large">
            <Text style={styles.sectionTitle}>Төлбөрийн мэдээлэл</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Үлдэгдэл зээл:</Text>
              <Text style={[styles.detailValue, { color: COLORS.error }]}>
                {formatCurrency(loan.remainingAmount)}
              </Text>
            </View>

            {loan.penaltyAmount > 0 && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: COLORS.error }]}>
                  Алданги:
                </Text>
                <Text style={[styles.detailValue, { color: COLORS.error }]}>
                  {formatCurrency(loan.penaltyAmount)}
                </Text>
              </View>
            )}

            {loan.overdueDays > 0 && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: COLORS.error }]}>
                  Хоцорсон хоног:
                </Text>
                <Text style={[styles.detailValue, { color: COLORS.error }]}>
                  {loan.overdueDays} хоног
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabelBold}>Нийт төлөх:</Text>
              <Text style={[styles.detailValueBold, { color: COLORS.primary }]}>
                {formatCurrency(totalDue)}
              </Text>
            </View>

            <Button
              title={`Зээл төлөх (${formatCurrency(totalDue)})`}
              onPress={handleRepayLoan}
              loading={paying}
              fullWidth
              style={styles.payButton}
            />
          </Card>
        )}

        {/* Repaid Info */}
        {loan.status === 'repaid' && (
          <Card style={styles.repaidCard} padding="large">
            <Text style={styles.repaidIcon}>✓</Text>
            <Text style={styles.repaidTitle}>Зээл төлөгдсөн</Text>
            <Text style={styles.repaidText}>
              Төлсөн огноо: {formatDate(loan.repaidAt)}
            </Text>
          </Card>
        )}

        {/* Cancelled Info */}
        {loan.status === 'cancelled' && loan.rejectionReason && (
          <Card style={styles.cancelledCard} padding="large">
            <Text style={styles.cancelledTitle}>Татгалзсан шалтгаан</Text>
            <Text style={styles.cancelledText}>{loan.rejectionReason}</Text>
          </Card>
        )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textSecondary,
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
  statusCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusText: {
    ...TEXT_STYLES.h4,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  loanNumber: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  sectionTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  detailLabelBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  detailValueBold: {
    ...TEXT_STYLES.h4,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  purposeText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  paymentCard: {
    backgroundColor: COLORS.backgroundGray,
    marginBottom: SPACING.lg,
  },
  payButton: {
    marginTop: SPACING.md,
  },
  repaidCard: {
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  repaidIcon: {
    fontSize: 50,
    marginBottom: SPACING.sm,
  },
  repaidTitle: {
    ...TEXT_STYLES.h4,
    color: COLORS.success,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  repaidText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },
  cancelledCard: {
    backgroundColor: COLORS.errorLight,
    marginBottom: SPACING.lg,
  },
  cancelledTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.error,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  cancelledText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },
});

export default LoanDetailScreen;