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
import { useWallet } from '../../hooks/useWallet';
import { formatCurrency, formatDate } from '../../utils/formatters';

const WalletScreen = () => {
  const router = useRouter();
  const { wallet, transactions, refreshWallet, loadTransactions, verifyEmongola, isLoading } = useWallet();
  
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([refreshWallet(), loadTransactions(1, true)]);
  };

  const handleVerify = async () => {
    try {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      await verifyEmongola();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'loan_disbursement':
        return { emoji: '💰', color: '#6BCF7F' };
      case 'loan_payment':
        return { emoji: '💸', color: '#FF6B9D' };
      case 'verification_fee':
        return { emoji: '✓', color: '#5DADE2' };
      default:
        return { emoji: '💳', color: '#64748B' };
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'loan_disbursement':
        return 'Зээл олгох';
      case 'loan_payment':
        return 'Зээл төлөлт';
      case 'verification_fee':
        return 'Баталгаажуулах';
      default:
        return type;
    }
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
          <Text style={styles.title}>Хэтэвч</Text>
        </View>

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
          
          {/* BALANCE CARD */}
          <Animated.View style={[styles.balanceWrapper, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient
              colors={['#4ECDC4', '#38A3A5']}
              style={styles.balanceCard}>
              
              <View style={styles.balanceTop}>
                <Text style={styles.balanceLabel}>💰 Нийт үлдэгдэл</Text>
                {wallet?.isEmongolaVerified ? (
                  <View style={styles.verified}>
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.locked}>
                    <Text style={styles.lockedText}>🔒</Text>
                  </View>
                )}
              </View>

              <Text style={styles.balanceAmount}>
                {formatCurrency(wallet?.balance || 0)}
              </Text>

              {wallet?.isEmongolaVerified ? (
                <View style={styles.creditBox}>
                  <View style={styles.creditRow}>
                    <Text style={styles.creditLabel}>Зээлийн лимит</Text>
                    <Text style={styles.creditValue}>
                      {formatCurrency(wallet?.creditLimit || 0)}
                    </Text>
                  </View>
                  
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${((wallet?.creditLimit - wallet?.availableCredit) / wallet?.creditLimit) * 100}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.creditRow}>
                    <Text style={styles.creditLabel}>Боломжит</Text>
                    <Text style={styles.creditValue}>
                      {formatCurrency(wallet?.availableCredit || 0)}
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.verifyBtn}
                  onPress={handleVerify}
                  disabled={isLoading}>
                  <Text style={styles.verifyText}>
                    🔓 E-Mongolia баталгаажуулах (3,000₮)
                  </Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </Animated.View>

          {/* QUICK STATS */}
          {wallet?.isEmongolaVerified && (
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#6BCF7F', '#4CAF50']}
                  style={styles.statGrad}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={styles.statLabel}>Зээлийн түүх</Text>
                  <Text style={styles.statValue}>{wallet?.loanHistory || 0}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['#FFD93D', '#FF8C42']}
                  style={styles.statGrad}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={styles.statLabel}>Зээлийн оноо</Text>
                  <Text style={styles.statValue}>{wallet?.creditScore || 0}</Text>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* TRANSACTIONS */}
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📊 Гүйлгээний түүх</Text>
            </View>

            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => {
                const icon = getTransactionIcon(transaction.type);
                const isCredit = transaction.amount > 0;

                return (
                  <View key={transaction._id} style={styles.transactionCard}>
                    <View style={styles.transactionLeft}>
                      <View
                        style={[
                          styles.transactionIcon,
                          { backgroundColor: `${icon.color}15` },
                        ]}>
                        <Text style={styles.transactionEmoji}>{icon.emoji}</Text>
                      </View>
                      
                      <View style={styles.transactionInfo}>
                        <Text style={styles.transactionType}>
                          {getTransactionLabel(transaction.type)}
                        </Text>
                        <Text style={styles.transactionDate}>
                          {formatDate(transaction.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.transactionAmount,
                        { color: isCredit ? '#6BCF7F' : '#FF6B9D' },
                      ]}>
                      {isCredit ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyText}>
                  Гүйлгээний түүх байхгүй байна
                </Text>
              </View>
            )}
          </View>

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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },

  // Balance Card
  balanceWrapper: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceCard: {
    padding: 24,
    borderRadius: 20,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  verified: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
  },
  locked: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 20,
  },
  creditBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  creditValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD93D',
    borderRadius: 3,
  },
  verifyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  statGrad: {
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },

  // Transactions
  transactionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  transactionCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: '#64748B',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default WalletScreen;