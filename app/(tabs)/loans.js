import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLoans } from '../../hooks/useLoans';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, SPACING } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LoansScreen = () => {
  const router = useRouter();
  const {
    activeLoans,
    completedLoans,
    isLoading,
    loadActiveLoans,
    loadCompletedLoans,
  } = useLoans();

  const [selectedTab, setSelectedTab] = useState('active'); // active, completed
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Fade in animation when tab changes
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [selectedTab]);

  const loadData = async () => {
    fadeAnim.setValue(0);
    await Promise.all([loadActiveLoans(), loadCompletedLoans()]);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const currentLoans = selectedTab === 'active' ? activeLoans : completedLoans;

  const renderLoanCard = (loan, index) => {
    const isActive = selectedTab === 'active';
    const progress = isActive
      ? ((loan.amount - loan.remainingAmount) / loan.amount) * 100
      : 100;

    const statusColor = loan.status === 'active' 
      ? COLORS.success 
      : loan.status === 'overdue'
      ? COLORS.error
      : COLORS.textSecondary;

    const statusText = loan.status === 'active'
      ? '✅ Идэвхтэй'
      : loan.status === 'overdue'
      ? '⚠️ Хугацаа хэтэрсэн'
      : '✔️ Дууссан';

    return (
      <TouchableOpacity
        key={loan._id}
        style={styles.loanCardContainer}
        onPress={() => router.push(`/loan-detail/${loan._id}`)}
        activeOpacity={0.85}>
        <LinearGradient
          colors={
            loan.status === 'active'
              ? GRADIENTS.primary
              : loan.status === 'overdue'
              ? GRADIENTS.fire
              : GRADIENTS.silver
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.loanCard, SHADOWS.medium]}>
          
          {/* HEADER */}
          <View style={styles.loanHeader}>
            <View style={styles.loanHeaderLeft}>
              <Text style={styles.loanIcon}>💳</Text>
              <View>
                <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{statusText}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => router.push(`/loan-detail/${loan._id}`)}>
              <Text style={styles.detailIcon}>→</Text>
            </TouchableOpacity>
          </View>

          {/* AMOUNTS */}
          <View style={styles.amountsSection}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Зээлийн дүн</Text>
              <Text style={styles.amountValue}>
                {formatCurrency(loan.amount)}
              </Text>
            </View>
            
            {isActive && (
              <>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Үлдэгдэл</Text>
                  <Text style={[styles.amountValue, styles.remainingAmount]}>
                    {formatCurrency(loan.remainingAmount)}
                  </Text>
                </View>
                
                {/* PROGRESS BAR */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${progress}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
                </View>
              </>
            )}
          </View>

          {/* DATES */}
          <View style={styles.datesSection}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Эхлэх огноо</Text>
              <Text style={styles.dateValue}>
                {formatDate(loan.startDate)}
              </Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Дуусах огноо</Text>
              <Text style={styles.dateValue}>
                {formatDate(loan.dueDate)}
              </Text>
            </View>
          </View>

          {/* ACTION BUTTON */}
          {isActive && loan.status === 'active' && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => router.push(`/loan-detail/${loan._id}`)}>
              <Text style={styles.payButtonText}>Төлөлт хийх</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <Card padding="large">
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>
          {selectedTab === 'active' ? '💰' : '✅'}
        </Text>
        <Text style={styles.emptyTitle}>
          {selectedTab === 'active' 
            ? 'Идэвхтэй зээл байхгүй байна'
            : 'Төлөгдсөн зээл байхгүй байна'}
        </Text>
        <Text style={styles.emptyText}>
          {selectedTab === 'active'
            ? 'Зээл авахын тулд доорх товчийг дарна уу'
            : 'Таны төлөгдсөн зээлийн түүх энд харагдана'}
        </Text>
        {selectedTab === 'active' && (
          <Button
            title="Зээл авах"
            variant="gradient"
            onPress={() => router.push('/loan-request')}
            style={styles.emptyButton}
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Миний зээлүүд</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/loan-request')}>
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.addButtonGradient}>
            <Text style={styles.addButtonIcon}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* TAB NAVIGATION */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
          onPress={() => setSelectedTab('active')}>
          <LinearGradient
            colors={
              selectedTab === 'active' 
                ? GRADIENTS.primary 
                : [COLORS.transparent, COLORS.transparent]
            }
            style={styles.tabGradient}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'active' && styles.tabTextActive,
              ]}>
              Идэвхтэй ({activeLoans?.length || 0})
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
          onPress={() => setSelectedTab('completed')}>
          <LinearGradient
            colors={
              selectedTab === 'completed'
                ? GRADIENTS.primary
                : [COLORS.transparent, COLORS.transparent]
            }
            style={styles.tabGradient}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'completed' && styles.tabTextActive,
              ]}>
              Төлөгдсөн ({completedLoans?.length || 0})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* LOANS LIST */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}>
        
        <Animated.View style={{ opacity: fadeAnim }}>
          {currentLoans && currentLoans.length > 0 ? (
            currentLoans.map((loan, index) => renderLoanCard(loan, index))
          ) : (
            renderEmptyState()
          )}
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  addButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    ...TEXT_STYLES.h3,
    color: COLORS.textWhite,
    fontWeight: '300',
  },
  
  // TABS
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: RADIUS.md,
  },
  tabActive: {
    ...SHADOWS.small,
  },
  tabGradient: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  tabText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.textWhite,
  },
  
  // SCROLL VIEW
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  
  // LOAN CARD
  loanCardContainer: {
    marginBottom: SPACING.md,
  },
  loanCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  loanHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loanIcon: {
    fontSize: 40,
    marginRight: SPACING.sm,
  },
  loanNumber: {
    ...TEXT_STYLES.h5,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
  },
  statusText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  detailButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIcon: {
    ...TEXT_STYLES.h5,
    color: COLORS.textWhite,
    fontWeight: '300',
  },
  
  // AMOUNTS
  amountsSection: {
    marginBottom: SPACING.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  amountLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  amountValue: {
    ...TEXT_STYLES.h5,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  remainingAmount: {
    fontSize: 24,
  },
  
  // PROGRESS
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.textWhite,
    borderRadius: 4,
  },
  progressText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  
  // DATES
  datesSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
  },
  dateDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    opacity: 0.7,
    marginBottom: 4,
  },
  dateValue: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  
  // PAY BUTTON
  payButton: {
    backgroundColor: COLORS.textWhite,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  payButtonText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  // EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  emptyText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default LoansScreen;