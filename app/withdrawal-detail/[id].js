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
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getWithdrawalStatusColor,
  getWithdrawalStatusText,
  maskAccountNumber,
} from '../../utils/formatters';

const WithdrawalDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawalDetail();
  }, [id]);

  const loadWithdrawalDetail = async () => {
    try {
      setLoading(true);
      
      // Mock data - Та энийг services/walletService.js-д getWithdrawalDetail функц үүсгэж солино
      // const response = await walletService.getWithdrawalDetail(id);
      
      // Одоогоор mock data
      setTimeout(() => {
        setWithdrawal({
          _id: id,
          withdrawalNumber: 'WD202602000001',
          amount: 50000,
          bankName: 'Хаан банк',
          bankAccountNumber: '1234567890',
          accountName: 'Батболд Баяр',
          status: 'pending',
          balanceBefore: 100000,
          balanceAfter: 50000,
          notes: 'Гэрийн зардал',
          createdAt: new Date(),
          processedAt: null,
          completedAt: null,
          rejectionReason: null,
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      Alert.alert(
        'Алдаа',
        error.message || 'Дэлгэрэнгүй авахад алдаа гарлаа',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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

  if (!withdrawal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Хүсэлт олдсонгүй</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getWithdrawalStatusColor(withdrawal.status);
  const statusText = getWithdrawalStatusText(withdrawal.status);

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
          <Text style={styles.headerTitle}>Татлагын дэлгэрэнгүй</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* Status Card */}
        <Card style={[styles.statusCard, { backgroundColor: statusColor }]} padding="large">
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.withdrawalNumber}>{withdrawal.withdrawalNumber}</Text>
        </Card>

        {/* Amount Info */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Мөнгөний мэдээлэл</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Татах дүн:</Text>
            <Text style={styles.detailValueAmount}>
              {formatCurrency(withdrawal.amount)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Өмнөх үлдэгдэл:</Text>
            <Text style={styles.detailValue}>
              {formatCurrency(withdrawal.balanceBefore)}
            </Text>
          </View>

          {withdrawal.status === 'completed' && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Дараах үлдэгдэл:</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(withdrawal.balanceAfter)}
              </Text>
            </View>
          )}
        </Card>

        {/* Bank Info */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Дансны мэдээлэл</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Банк:</Text>
            <Text style={styles.detailValue}>{withdrawal.bankName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Дансны дугаар:</Text>
            <Text style={styles.detailValue}>
              {maskAccountNumber(withdrawal.bankAccountNumber)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Эзэмшигч:</Text>
            <Text style={styles.detailValue}>{withdrawal.accountName}</Text>
          </View>

          {withdrawal.notes && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Тэмдэглэл:</Text>
              </View>
              <Text style={styles.notesText}>{withdrawal.notes}</Text>
            </>
          )}
        </Card>

        {/* Timeline */}
        <Card padding="large">
          <Text style={styles.sectionTitle}>Түүх</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Хүсэлт үүсгэсэн</Text>
              <Text style={styles.timelineDate}>
                {formatDate(withdrawal.createdAt, true)}
              </Text>
            </View>
          </View>

          {withdrawal.processedAt && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: COLORS.info }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  {withdrawal.status === 'approved' || withdrawal.status === 'completed'
                    ? 'Зөвшөөрөгдсөн'
                    : 'Татгалзсан'}
                </Text>
                <Text style={styles.timelineDate}>
                  {formatDate(withdrawal.processedAt, true)}
                </Text>
              </View>
            </View>
          )}

          {withdrawal.completedAt && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: COLORS.success }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Дууссан</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(withdrawal.completedAt, true)}
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* Rejection Reason */}
        {withdrawal.status === 'rejected' && withdrawal.rejectionReason && (
          <Card style={styles.rejectionCard} padding="large">
            <Text style={styles.rejectionTitle}>Татгалзсан шалтгаан</Text>
            <Text style={styles.rejectionText}>{withdrawal.rejectionReason}</Text>
          </Card>
        )}

        {/* Pending Info */}
        {withdrawal.status === 'pending' && (
          <Card style={styles.infoCard} padding="medium">
            <Text style={styles.infoTitle}>ℹ️ Анхаар</Text>
            <Text style={styles.infoText}>
              Таны хүсэлт хянагдаж байна. Operator баталгаажуулсны дараа 
              таны дансанд 1-3 ажлын өдөрт мөнгө орно.
            </Text>
          </Card>
        )}

        {/* Completed Info */}
        {withdrawal.status === 'completed' && (
          <Card style={styles.successCard} padding="medium">
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Амжилттай дууслаа</Text>
            <Text style={styles.successText}>
              Мөнгө таны {withdrawal.bankName} дансанд орсон байна.
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
  withdrawalNumber: {
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
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  notesText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
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
  rejectionCard: {
    backgroundColor: COLORS.errorLight,
    marginBottom: SPACING.lg,
  },
  rejectionTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.error,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  rejectionText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
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
  successCard: {
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  successIcon: {
    fontSize: 50,
    marginBottom: SPACING.sm,
  },
  successTitle: {
    ...TEXT_STYLES.h4,
    color: COLORS.success,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  successText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
});

export default WithdrawalDetailScreen;