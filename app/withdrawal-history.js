import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import walletService from '../services/walletService';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/globalStyles';
import { TEXT_STYLES } from '../styles/typography';
import {
  formatCurrency,
  formatDate,
  getWithdrawalStatusColor,
  getWithdrawalStatusText,
} from '../utils/formatters';

const WithdrawalHistoryScreen = () => {
  const router = useRouter();

  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadWithdrawals(1, true);
  }, []);

  const loadWithdrawals = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const response = await walletService.getMyWithdrawals(null, pageNum, 20);

      if (response.success) {
        const newWithdrawals = response.data.withdrawals;

        if (refresh) {
          setWithdrawals(newWithdrawals);
        } else {
          setWithdrawals(prev => [...prev, ...newWithdrawals]);
        }

        setHasMore(response.data.pagination.page < response.data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Withdrawals ачаалах алдаа:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadWithdrawals(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadWithdrawals(page + 1, false);
    }
  };

  const renderWithdrawal = ({ item }) => {
    const statusColor = getWithdrawalStatusColor(item.status);
    const statusText = getWithdrawalStatusText(item.status);

    return (
      <Card
        padding="medium"
        onPress={() => router.push(`/withdrawal-detail/${item._id}`)}>
        <View style={styles.withdrawalHeader}>
          <View>
            <Text style={styles.withdrawalNumber}>{item.withdrawalNumber}</Text>
            <Text style={styles.withdrawalDate}>
              {formatDate(item.createdAt, true)}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.withdrawalRow}>
          <Text style={styles.label}>Дүн:</Text>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        </View>

        <View style={styles.withdrawalRow}>
          <Text style={styles.label}>Банк:</Text>
          <Text style={styles.value}>{item.bankName}</Text>
        </View>

        <View style={styles.withdrawalRow}>
          <Text style={styles.label}>Данс:</Text>
          <Text style={styles.value}>
            ****{item.bankAccountNumber?.slice(-4)}
          </Text>
        </View>

        {item.status === 'completed' && item.completedAt && (
          <View style={styles.withdrawalRow}>
            <Text style={[styles.label, { color: COLORS.success }]}>
              Дууссан:
            </Text>
            <Text style={styles.value}>
              {formatDate(item.completedAt, true)}
            </Text>
          </View>
        )}

        {item.status === 'rejected' && item.rejectionReason && (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionLabel}>Татгалзсан шалтгаан:</Text>
            <Text style={styles.rejectionText}>{item.rejectionReason}</Text>
          </View>
        )}
      </Card>
    );
  };

  const renderEmpty = () => {
    if (isLoading && withdrawals.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📭</Text>
        <Text style={styles.emptyText}>Мөнгө татах хүсэлт олдсонгүй</Text>
        <Text style={styles.emptySubtext}>
          Та мөнгө татах хүсэлт илгээгээгүй байна
        </Text>
        <Button
          title="Мөнгө татах"
          onPress={() => router.push('/withdraw')}
          style={styles.emptyButton}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore || withdrawals.length === 0) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title="← Буцах"
          onPress={() => router.back()}
          variant="outline"
          size="small"
        />
        <Text style={styles.headerTitle}>Татлагын түүх</Text>
        <View style={{ width: 70 }} />
      </View>

      {/* List */}
      <FlatList
        data={withdrawals}
        renderItem={renderWithdrawal}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  withdrawalNumber: {
    ...TEXT_STYLES.h6,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  withdrawalDate: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  statusText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  withdrawalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  value: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },
  amount: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  rejectionBox: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.errorLight,
    borderRadius: 8,
  },
  rejectionLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  rejectionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textPrimary,
  },
  footer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  emptyText: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    minWidth: 150,
  },
});

export default WithdrawalHistoryScreen;