import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoans } from '../../hooks/useLoans';
import { formatCurrency, formatDate } from '../../utils/formatters';

const LoansScreen = () => {
  const router = useRouter();
  const { activeLoans, completedLoans, loadActiveLoans, loadCompletedLoans, isLoading } = useLoans();
  
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadActiveLoans(), loadCompletedLoans()]);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === 'active' ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: '#FFF5F7', text: '#FF6B9D', label: 'Идэвхтэй' };
      case 'repaid':
        return { bg: '#F0FDF4', text: '#6BCF7F', label: 'Төлөгдсөн' };
      case 'overdue':
        return { bg: '#FEF2F2', text: '#FF6B6B', label: 'Хугацаа хэтэрсэн' };
      default:
        return { bg: '#F5F7FA', text: '#64748B', label: status };
    }
  };

  const renderLoanCard = (loan) => {
    const status = getStatusColor(loan.status);
    const isActive = loan.status === 'active';

    return (
      <TouchableOpacity
        key={loan._id}
        style={styles.loanCard}
        activeOpacity={0.8}
        onPress={() => router.push(`/loan-detail/${loan._id}`)}>
        
        {/* Top Row */}
        <View style={styles.loanHeader}>
          <View style={styles.loanTop}>
            <View style={[styles.iconCircle, { backgroundColor: status.bg }]}>
              <Text style={styles.iconEmoji}>
                {isActive ? '💰' : '✅'}
              </Text>
            </View>
            <View style={styles.loanInfo}>
              <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusText, { color: status.text }]}>
                  {status.label}
                </Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.arrow}>→</Text>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
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
                <Text style={[styles.amountValue, { color: '#FF6B9D' }]}>
                  {formatCurrency(loan.remainingAmount)}
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#FF6B9D', '#C44569']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      {
                        width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercent}>
                  {Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)}%
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Dates */}
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Огноо</Text>
            <Text style={styles.dateValue}>{formatDate(loan.createdAt)}</Text>
          </View>
          {loan.dueDate && (
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Хугацаа</Text>
              <Text style={styles.dateValue}>{formatDate(loan.dueDate)}</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        {isActive && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => router.push(`/loan-detail/${loan._id}`)}>
            <LinearGradient
              colors={['#FF6B9D', '#C44569']}
              style={styles.payButtonGrad}>
              <Text style={styles.payButtonText}>Төлөх</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const displayLoans = activeTab === 'active' ? activeLoans : completedLoans;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F7FA', '#ECF0F3']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Миний зээлүүд</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/loan-request')}>
            <LinearGradient
              colors={['#FFD93D', '#FF8C42']}
              style={styles.addButtonGrad}>
              <Text style={styles.addButtonText}>+ Зээл авах</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'active' && styles.tabActive,
              ]}
              onPress={() => handleTabChange('active')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'active' && styles.tabTextActive,
                ]}>
                ⚡ Идэвхтэй
              </Text>
              {activeLoans?.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{activeLoans.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'completed' && styles.tabActive,
              ]}
              onPress={() => handleTabChange('completed')}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'completed' && styles.tabTextActive,
                ]}>
                ✅ Төлөгдсөн
              </Text>
              {completedLoans?.length > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.tabBadgeText, { color: '#6BCF7F' }]}>
                    {completedLoans.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Sliding Indicator */}
          <Animated.View
            style={[
              styles.indicator,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 170],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* CONTENT */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor="#FF6B9D"
            />
          }
          showsVerticalScrollIndicator={false}>
          
          {displayLoans && displayLoans.length > 0 ? (
            displayLoans.map(renderLoanCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                {activeTab === 'active' ? '💰' : '✅'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'active'
                  ? 'Идэвхтэй зээл байхгүй'
                  : 'Төлөгдсөн зээл байхгүй'}
              </Text>
              <Text style={styles.emptyText}>
                {activeTab === 'active'
                  ? 'Шинэ зээл авахын тулд дээрх товчийг дарна уу'
                  : 'Та хараахан зээлээ төлөөгүй байна'}
              </Text>
            </View>
          )}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  addButtonGrad: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  // Tabs
  tabs: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#FFF5F7',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FF6B9D',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B9D',
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    left: 24,
    width: 160,
    height: 44,
    backgroundColor: '#FFF5F7',
    borderRadius: 8,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Loan Card
  loanCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  loanInfo: {
    gap: 6,
  },
  loanNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    color: '#CBD5E1',
  },

  // Amount Section
  amountSection: {
    gap: 12,
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B9D',
    minWidth: 40,
    textAlign: 'right',
  },

  // Dates
  dateRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A2E',
  },

  // Pay Button
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  payButtonGrad: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoansScreen;