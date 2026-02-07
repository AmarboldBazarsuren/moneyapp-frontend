import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoanList from '../../components/loan/LoanList';
import Button from '../../components/ui/Button';
import { useLoans } from '../../hooks/useLoans';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';

const LoansScreen = () => {
  const router = useRouter();
  const {
    loans,
    isLoading,
    refresh,
    loadMore,
    hasMore,
    loadLoans,
  } = useLoans();

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { value: 'all', label: 'Бүгд' },
    { value: 'active', label: 'Идэвхтэй' },
    { value: 'pending', label: 'Хүлээгдэж байна' },
    { value: 'repaid', label: 'Төлөгдсөн' },
    { value: 'overdue', label: 'Хугацаа хэтэрсэн' },
  ];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    const status = filter === 'all' ? null : filter;
    loadLoans(status, 1, true);
  };

  const handleLoanPress = (loan) => {
    router.push(`/loan-detail/${loan._id}`);
  };

  const handleRequestLoan = () => {
    router.push('/loan-request');
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>Зээл олдсонгүй</Text>
      <Text style={styles.emptyText}>
        Та одоогоор зээл авах хүсэлт илгээгээгүй байна
      </Text>
      <Button
        title="Зээл авах"
        onPress={handleRequestLoan}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Миний зээлүүд</Text>
        <Button
          title="+ Зээл авах"
          onPress={handleRequestLoan}
          size="small"
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange(filter.value)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.filterTextActive,
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loan List */}
      <LoanList
        loans={loans}
        isLoading={isLoading}
        onRefresh={refresh}
        onLoadMore={loadMore}
        onLoanPress={handleLoanPress}
        hasMore={hasMore}
        ListEmptyComponent={<EmptyComponent />}
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.backgroundGray,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.textWhite,
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
  emptyTitle: {
    ...TEXT_STYLES.h4,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  emptyText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    minWidth: 150,
  },
});

export default LoansScreen;