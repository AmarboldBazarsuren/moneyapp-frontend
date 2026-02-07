import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import walletService from '../../services/walletService';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeText,
} from '../../utils/formatters';

const TransactionDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactionDetail();
  }, [id]);

  const loadTransactionDetail = async () => {
    try {
      setLoading(true);
      const response = await walletService.getTransactionDetail(id);

      if (response.success) {
        setTransaction(response.data);
      }
    } catch (error) {
      Alert.alert(
        'Алдаа',
        error.message || 'Дэлгэрэнгүй авахад алдаа гарлаа',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
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

  if (!transaction) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Гүйлгээ олдсонгүй</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isIncome = ['loan_disbursement', 'deposit'].includes(transaction.type);
  const statusColor = 
    transaction.status === 'completed' ? COLORS.success :
    transaction.status === 'failed' ? COLORS.error :
    transaction.status === 'pending' ? COLORS.warning :
    COLORS.textDisabled;

  const statusText = 
    transaction.status === 'completed' ? 'Амжилттай' :
    transaction.status === 'failed' ? 'Амжилтгүй' :
    transaction.status === 'pending' ? 'Хүлээгдэж байна' :
    'Цуцлагдсан';

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
          <Text style={styles.headerTitle}>Гүйлгээний дэлгэрэнгүй</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Status Card */}
        <Card style={[styles.statusCard, { backgroundColor: statusColor }]} padding="large">
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.transactionId}>{transaction.transactionId}</Text>
        </Card>

        {/* Amount Info */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Гүйлгээний мэдээлэл</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Төрөл:</Text>
            <Text style={styles.detailValue}>
              {getTransactionTypeText(transaction.type)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дүн:</Text>
            <Text style={[
              styles.detailValueAmount,
              { color: isIncome ? COLORS.success : COLORS.error }
            ]}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Өмнөх үлдэгдэл:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(transaction.balanceBefore)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дараах үлдэгдэл:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(transaction.balanceAfter)}
            </Text>
          </View>

          {transaction.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Тайлбар:</Text>
              </View>
              <Text style={styles.descriptionText}>{transaction.description}</Text>
            </>
          )}
        </Card>

        {/* Related Loan Info */}
        {transaction.relatedLoan && (
          <Card padding="large" onPress={() => router.push(`/loan-detail/${transaction.relatedLoan._id}`)}>
            <Text style={styles.sectionTitle}>Холбогдох зээл</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Зээлийн дугаар:</Text>
              <Text style={styles.detailValue}>
                {transaction.relatedLoan.loanNumber}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Зээлийн дүн:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(transaction.relatedLoan.principalAmount)}
              </Text>
            </View>

            <Text style={styles.linkText}>Дэлгэрэнгүй харах →</Text>
          </Card>
        )}

        {/* Payment Method */}
        {transaction.paymentMethod && (
          <Card padding="large">
            <Text style={styles.sectionTitle}>Төлбөрийн хэрэгсэл</Text>

            <View style={styles.paymentMethod}>
              <View style={styles.paymentMethodIcon}>
                <Text style={styles.paymentMethodEmoji}>
                  {transaction.paymentMethod === 'qpay' ? '💳' : '🏦'}
                </Text>
              </View>
              <Text style={styles.paymentMethodText}>
                {transaction.paymentMethod === 'qpay' ? 'QPay' : 
                 transaction.paymentMethod === 'bank_transfer' ? 'Банк' :
                 transaction.paymentMethod === 'cash' ? 'Бэлэн мөнгө' : 'Карт'}
              </Text>
            </View>
          </Card>
        )}

        {/* Timeline */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Түүх</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Гүйлгээ үүссэн</Text>
              <Text style={styles.timelineDate}>
                {formatDate(transaction.createdAt, true)}
              </Text>
            </View>
          </View>

          {transaction.completedAt && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: COLORS.success }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Амжилттай</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(transaction.completedAt, true)}
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* Failed Reason */}
        {transaction.status === 'failed' && transaction.failedReason && (
          <Card style={styles.errorCard} padding="large">
            <Text style={styles.errorTitle}>Амжилтгүй болсон шалтгаан</Text>
            <Text style={styles.errorText}>{transaction.failedReason}</Text>
          </Card>
        )}

        {/* Pending Info */}
        {transaction.status === 'pending' && (
          <Card style={styles.infoCard} padding="medium">
            <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
            <Text style={styles.infoText}>
              Гүйлгээ хүлээгдэж байна. Төлбөр баталгаажсаны дараа 
              таны хэтэвчинд орно.
            </Text>
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
  transactionId: {
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
  detailValueAmount: {
    ...TEXT_STYLES.h4,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  descriptionText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  linkText: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  paymentMethodEmoji: {
    fontSize: 20,
  },
  paymentMethodText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    marginRight: SPACING.sm,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  timelineDate: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  errorCard: {
    backgroundColor: COLORS.errorLight,
    marginBottom: SPACING.lg,
  },
  errorTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.error,
    fontWeight: '700',
    marginBottom: SPACING.xs,
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
});

export default TransactionDetailScreen;