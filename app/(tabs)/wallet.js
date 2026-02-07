import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, SPACING } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeText,
} from '../../utils/formatters';
import { APP_CONFIG } from '../../constants/config';

const WalletScreen = () => {
  const router = useRouter();
  const { wallet } = useAuth();
  const {
    transactions,
    isLoading,
    refresh,
    verifyEmongola,
    loadMore,
    hasMore,
  } = useWallet();

  const [verifying, setVerifying] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all'); // all, income, expense

  const handleVerifyEmongola = async () => {
    Alert.alert(
      'E-Mongolia баталгаажуулах',
      `Та ${formatCurrency(APP_CONFIG.EMONGOLA_VERIFICATION_FEE)} төлж E-Mongolia мэдээллээ баталгаажуулах уу?`,
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Төлөх',
          onPress: async () => {
            try {
              setVerifying(true);
              const response = await verifyEmongola();
              
              if (response.success) {
                Alert.alert(
                  'Амжилттай',
                  response.data?.wallet?.isEmongolaVerified
                    ? 'E-Mongolia мэдээлэл амжилттай баталгаажлаа!'
                    : 'Баталгаажуулалтын төлбөр үүслээ. QPay-р төлнө үү.',
                  [{ text: 'OK' }]
                );
                refresh();
              }
            } catch (error) {
              Alert.alert('Алдаа', error.message || 'Алдаа гарлаа');
            } finally {
              setVerifying(false);
            }
          },
        },
      ]
    );
  };

  // Орлого/Зарлагын filter
  const filteredTransactions = transactions.filter(tx => {
    if (selectedTab === 'all') return true;
    
    const incomeTypes = ['loan_disbursement', 'deposit'];
    const expenseTypes = ['emongola_verification', 'loan_repayment', 'withdrawal', 'penalty'];
    
    if (selectedTab === 'income') {
      return incomeTypes.includes(tx.type);
    }
    if (selectedTab === 'expense') {
      return expenseTypes.includes(tx.type);
    }
    return true;
  });

  // Нийт орлого/зарлага тооцоолох
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(tx => {
      const incomeTypes = ['loan_disbursement', 'deposit'];
      if (incomeTypes.includes(tx.type) && tx.status === 'completed') {
        totalIncome += tx.amount;
      } else if (tx.status === 'completed') {
        totalExpense += tx.amount;
      }
    });

    return { totalIncome, totalExpense };
  };

  const { totalIncome, totalExpense } = calculateTotals();

  const renderTransaction = (transaction) => {
    const isIncome = ['loan_disbursement', 'deposit'].includes(transaction.type);
    const amount = isIncome ? `+${formatCurrency(transaction.amount)}` : `-${formatCurrency(transaction.amount)}`;
    const amountColor = isIncome ? COLORS.success : COLORS.error;

    return (
      <TouchableOpacity
        key={transaction._id}
        style={styles.transactionCard}
        onPress={() => router.push(`/transaction-detail/${transaction._id}`)}
        activeOpacity={0.7}>
        <View style={styles.transactionLeft}>
          <View style={[
            styles.transactionIcon,
            { backgroundColor: isIncome ? COLORS.successLight : COLORS.errorLight }
          ]}>
            <Text style={styles.transactionEmoji}>
              {isIncome ? '📥' : '📤'}
            </Text>
          </View>
          <View>
            <Text style={styles.transactionType}>
              {getTransactionTypeText(transaction.type)}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(transaction.createdAt, true)}
            </Text>
            {transaction.status === 'pending' && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>Хүлээгдэж байна</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: amountColor }]}>
          {amount}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom =
            layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isCloseToBottom && hasMore && !isLoading) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}>
        
        {/* 🎨 HEADER */}
        <Text style={styles.headerTitle}>Хэтэвч</Text>

        {/* 💰 ҮЛДЭГДЭЛ КАРТ - Premium Gradient */}
        <LinearGradient
          colors={wallet?.isEmongolaVerified ? GRADIENTS.primary : GRADIENTS.fire}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.balanceCard, SHADOWS.primaryGlow]}>
          
          <Text style={styles.balanceLabel}>Хэтэвчний үлдэгдэл</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(wallet?.balance || 0)}
          </Text>

          {wallet?.isEmongolaVerified ? (
            <>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>E-Mongolia баталгаажсан</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Зээлийн лимит:</Text>
                <Text style={styles.creditValue}>
                  {formatCurrency(wallet?.creditLimit || 0)}
                </Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Боломжит:</Text>
                <Text style={styles.creditValueBold}>
                  {formatCurrency(wallet?.availableCredit || 0)}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.unverifiedContainer}>
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  E-Mongolia мэдээлэл баталгаажаагүй
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={handleVerifyEmongola}>
                <Text style={styles.verifyButtonText}>
                  Баталгаажуулах ({formatCurrency(APP_CONFIG.EMONGOLA_VERIFICATION_FEE)})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        {/* ⚡ ХУРДАН ҮЙЛДЛҮҮД */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/deposit')}>
            <LinearGradient
              colors={GRADIENTS.ocean}
              style={styles.actionGradient}>
              <Text style={styles.actionIcon}>💰</Text>
            </LinearGradient>
            <Text style={styles.actionText}>Цэнэглэх</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/withdraw')}>
            <LinearGradient
              colors={GRADIENTS.sunset}
              style={styles.actionGradient}>
              <Text style={styles.actionIcon}>💸</Text>
            </LinearGradient>
            <Text style={styles.actionText}>Татах</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/withdrawal-history')}>
            <LinearGradient
              colors={GRADIENTS.forest}
              style={styles.actionGradient}>
              <Text style={styles.actionIcon}>📋</Text>
            </LinearGradient>
            <Text style={styles.actionText}>Түүх</Text>
          </TouchableOpacity>
        </View>

        {/* 📊 ОРЛОГО/ЗАРЛАГА - Statistics Cards */}
        {wallet?.isEmongolaVerified && (
          <View style={styles.statsContainer}>
            <Card variant="outline" padding="medium" style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>📈</Text>
                <Text style={styles.statLabel}>Нийт орлого</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.success }]}>
                {formatCurrency(totalIncome)}
              </Text>
            </Card>

            <Card variant="outline" padding="medium" style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>📉</Text>
                <Text style={styles.statLabel}>Нийт зарлага</Text>
              </View>
              <Text style={[styles.statValue, { color: COLORS.error }]}>
                {formatCurrency(totalExpense)}
              </Text>
            </Card>
          </View>
        )}

        {/* 📝 ГҮЙЛГЭЭНИЙ ТҮҮХ - Tab система */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Гүйлгээний түүх</Text>
            {transactions.length > 0 && (
              <TouchableOpacity onPress={refresh}>
                <Text style={styles.refreshText}>🔄</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* TAB NAVIGATION */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
              onPress={() => setSelectedTab('all')}>
              <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
                Бүгд
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'income' && styles.tabActive]}
              onPress={() => setSelectedTab('income')}>
              <Text style={[styles.tabText, selectedTab === 'income' && styles.tabTextActive]}>
                Орлого
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'expense' && styles.tabActive]}
              onPress={() => setSelectedTab('expense')}>
              <Text style={[styles.tabText, selectedTab === 'expense' && styles.tabTextActive]}>
                Зарлага
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* TRANSACTIONS LIST */}
          {filteredTransactions.length === 0 ? (
            <Card padding="large">
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>
                {selectedTab === 'all' ? 'Гүйлгээ олдсонгүй' :
                 selectedTab === 'income' ? 'Орлого олдсонгүй' :
                 'Зарлага олдсонгүй'}
              </Text>
            </Card>
          ) : (
            <>
              {filteredTransactions.map(renderTransaction)}
              {isLoading && hasMore && (
                <Text style={styles.loadingText}>Ачааллаж байна...</Text>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  
  // HEADER
  headerTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  
  // BALANCE CARD
  balanceCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    ...TEXT_STYLES.h1,
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  verifiedIcon: {
    color: COLORS.textWhite,
    fontSize: 16,
    marginRight: 4,
  },
  verifiedText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.textWhite,
    opacity: 0.2,
    marginVertical: SPACING.md,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  creditLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
  creditValue: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  creditValueBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  unverifiedContainer: {
    marginTop: SPACING.md,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  warningText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
    flex: 1,
  },
  verifyButton: {
    backgroundColor: COLORS.textWhite,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  verifyButtonText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  // QUICK ACTIONS
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
  },
  actionGradient: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  
  // STATISTICS
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderWidth: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  statLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  statValue: {
    ...TEXT_STYLES.h4,
    fontWeight: '700',
  },
  
  // SECTION
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  refreshText: {
    fontSize: 20,
  },
  
  // TABS
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  
  // TRANSACTION CARD
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionType: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  pendingText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
    fontSize: 10,
  },
  transactionAmount: {
    ...TEXT_STYLES.h5,
    fontWeight: '700',
  },
  
  // EMPTY STATE
  emptyIcon: {
    fontSize: 50,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default WalletScreen;