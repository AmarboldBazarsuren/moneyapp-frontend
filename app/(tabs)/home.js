import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useLoans } from '../../hooks/useLoans';
import { formatCurrency } from '../../utils/formatters';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

const HomeScreen = () => {
  const router = useRouter();
  const { user, wallet } = useAuth();
  const { refreshWallet, isLoading: walletLoading } = useWallet();
  const { activeLoans, loadActiveLoans, isLoading: loansLoading } = useLoans();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const isLoading = walletLoading || loansLoading;

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadData = async () => {
    await Promise.all([refreshWallet(), loadActiveLoans()]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F7FA', '#ECF0F3']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadData}
              tintColor="#FF6B9D"
            />
          }>
          
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>

            {/* 🎯 MINIMAL HEADER */}
            <View style={styles.header}>
              <View>
                <Text style={styles.hello}>Сайн байна уу</Text>
                <Text style={styles.name}>{user?.firstName} 🎉</Text>
              </View>
              <TouchableOpacity 
                style={styles.avatar}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <LinearGradient
                  colors={['#FF6B9D', '#C44569']}
                  style={styles.avatarGrad}>
                  <Text style={styles.avatarText}>
                    {user?.firstName?.charAt(0)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* 💳 FLOATING BALANCE CARD */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/(tabs)/wallet')}
              style={styles.balanceWrapper}>
              <LinearGradient
                colors={['#FF6B9D', '#C44569']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceCard}>
                
                <View style={styles.balanceTop}>
                  <Text style={styles.balanceLabel}>💰 Миний үлдэгдэл</Text>
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
                      <Text style={styles.creditLabel}>Лимит</Text>
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
                    <Text style={styles.availableText}>
                      Боломжит: {formatCurrency(wallet?.availableCredit || 0)}
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.verifyBtn}
                    onPress={() => router.push('/(tabs)/wallet')}>
                    <Text style={styles.verifyText}>
                      🔓 Баталгаажуулах (3,000₮)
                    </Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* ⚡ QUICK ACTIONS - ЗАСВАРЛАСАН */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => router.push('/loan-request')}>
                <LinearGradient
                  colors={['#FFD93D', '#FF8C42']}
                  style={styles.actionGrad}>
                  <Text style={styles.actionIcon}>⚡</Text>
                  <Text style={styles.actionText}>Зээл авах</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => router.push('/(tabs)/loans')}>
                <LinearGradient
                  colors={['#4ECDC4', '#38A3A5']}
                  style={styles.actionGrad}>
                  <Text style={styles.actionIcon}>💎</Text>
                  <Text style={styles.actionText}>Миний зээл</Text>
                  {activeLoans?.length > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{activeLoans.length}</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* 🆕 ШИНЭ: Мөнгө татах товч */}
              <TouchableOpacity
                style={styles.actionPill}
                onPress={() => router.push('/withdraw')}>
                <LinearGradient
                  colors={['#6BCF7F', '#4CAF50']}
                  style={styles.actionGrad}>
                  <Text style={styles.actionIcon}>💸</Text>
                  <Text style={styles.actionText}>Мөнгө татах</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* 📊 ACTIVE LOANS */}
            {activeLoans && activeLoans.length > 0 && (
              <View style={styles.loansSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>⚡ Идэвхтэй зээлүүд</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/loans')}>
                    <Text style={styles.viewAll}>Бүгд →</Text>
                  </TouchableOpacity>
                </View>

                {activeLoans.slice(0, 2).map((loan) => (
                  <TouchableOpacity
                    key={loan._id}
                    style={styles.loanCard}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/loan-detail/${loan._id}`)}>
                    <View style={styles.loanLeft}>
                      <View style={styles.loanIcon}>
                        <Text style={styles.loanEmoji}>💰</Text>
                      </View>
                      <View>
                        <Text style={styles.loanNum}>{loan.loanNumber}</Text>
                        <Text style={styles.loanAmt}>
                          {formatCurrency(loan.remainingAmount)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.payBtn}>
                      <Text style={styles.payText}>Төлөх →</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* 💡 TIP CARD */}
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipText}>
                  Зээлээ цагтаа төлж, лимитээ нэмэгдүүл!
                </Text>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </Animated.View>
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
    paddingBottom: 24,
  },
  hello: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  avatarGrad: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },

  // Balance Card
  balanceWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#FF6B9D',
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
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD93D',
    borderRadius: 3,
  },
  availableText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
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

  // Quick Actions
  actions: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionPill: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  actionGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },

  // Loans Section
  loansSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  loanCard: {
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
  loanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loanEmoji: {
    fontSize: 24,
  },
  loanNum: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  loanAmt: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 2,
  },
  payBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF5F7',
    borderRadius: 12,
  },
  payText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B9D',
  },

  // Tip Card
  tipCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  tipIcon: {
    fontSize: 32,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
});

export default HomeScreen;