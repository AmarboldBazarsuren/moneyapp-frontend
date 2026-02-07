import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useLoans } from '../../hooks/useLoans';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, SPACING } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';
import { formatCurrency } from '../../utils/formatters';

const HomeScreen = () => {
  const router = useRouter();
  const { user, wallet } = useAuth();
  const { refreshWallet, isLoading: walletLoading } = useWallet();
  const { activeLoans, loadActiveLoans, isLoading: loansLoading } = useLoans();

  const isLoading = walletLoading || loansLoading;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      refreshWallet(),
      loadActiveLoans(),
    ]);
  };

  const handleRefresh = async () => {
    await loadData();
  };

  // Гол action-ууд
  const quickActions = [
    {
      icon: '💰',
      title: 'Зээл авах',
      subtitle: 'Хялбар зээл',
      color: GRADIENTS.primary,
      onPress: () => router.push('/loan-request'),
    },
    {
      icon: '📊',
      title: 'Миний зээл',
      subtitle: `${activeLoans?.length || 0} идэвхтэй`,
      color: GRADIENTS.ocean,
      onPress: () => router.push('/(tabs)/loans'),
    },
    {
      icon: '💳',
      title: 'Хэтэвч',
      subtitle: 'Үлдэгдэл',
      color: GRADIENTS.sunset,
      onPress: () => router.push('/(tabs)/wallet'),
    },
    {
      icon: '👤',
      title: 'Профайл',
      subtitle: 'Тохиргоо',
      color: GRADIENTS.forest,
      onPress: () => router.push('/(tabs)/profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
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
        
        {/* 🎨 ШИНЭ HEADER - Gradient background */}
        <LinearGradient
          colors={GRADIENTS.primaryVertical}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Сайн байна уу,</Text>
              <Text style={styles.userName}>
                {user?.lastName} {user?.firstName}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => {}}>
              <View style={styles.notificationDot} />
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 💰 ХЭТЭВЧНИЙ КАРТ - Glassmorphism */}
        <View style={styles.walletCardContainer}>
          <LinearGradient
            colors={wallet?.isEmongolaVerified ? GRADIENTS.primary : GRADIENTS.fire}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.walletCard, SHADOWS.primaryGlow]}>
            
            <View style={styles.walletHeader}>
              <View>
                <Text style={styles.walletLabel}>Хэтэвчний үлдэгдэл</Text>
                <Text style={styles.walletBalance}>
                  {formatCurrency(wallet?.balance || 0)}
                </Text>
              </View>
              
              {!wallet?.isEmongolaVerified && (
                <View style={styles.unverifiedBadge}>
                  <Text style={styles.unverifiedIcon}>⚠️</Text>
                </View>
              )}
            </View>

            {wallet?.isEmongolaVerified ? (
              <View style={styles.creditSection}>
                <View style={styles.creditRow}>
                  <Text style={styles.creditLabel}>Зээлийн лимит</Text>
                  <Text style={styles.creditValue}>
                    {formatCurrency(wallet?.creditLimit || 0)}
                  </Text>
                </View>
                <View style={styles.creditProgressBar}>
                  <View 
                    style={[
                      styles.creditProgressFill,
                      { 
                        width: `${((wallet?.creditLimit - wallet?.availableCredit) / wallet?.creditLimit) * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.creditAvailable}>
                  Боломжит: {formatCurrency(wallet?.availableCredit || 0)}
                </Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.verifyButton}
                onPress={() => router.push('/(tabs)/wallet')}>
                <Text style={styles.verifyButtonText}>
                  🔓 Баталгаажуулах (3,000₮)
                </Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        {/* ⚡ ХУРДАН ҮЙЛДЛҮҮД - Modern Grid */}
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.85}>
              <LinearGradient
                colors={action.color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.actionCardGradient, SHADOWS.small]}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 📊 ИДЭВХТЭЙ ЗЭЭЛҮҮД */}
        {activeLoans && activeLoans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Идэвхтэй зээлүүд</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/loans')}>
                <Text style={styles.seeAllText}>Бүгд →</Text>
              </TouchableOpacity>
            </View>

            {activeLoans.slice(0, 2).map((loan) => (
              <Card
                key={loan._id}
                variant="glass"
                onPress={() => router.push(`/loan-detail/${loan._id}`)}
                padding="medium">
                <View style={styles.loanCard}>
                  <View style={styles.loanCardLeft}>
                    <View style={styles.loanIconContainer}>
                      <Text style={styles.loanIcon}>💳</Text>
                    </View>
                    <View>
                      <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
                      <Text style={styles.loanAmount}>
                        {formatCurrency(loan.remainingAmount)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => router.push(`/loan-detail/${loan._id}`)}>
                    <Text style={styles.payButtonText}>Төлөх</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* 💡 ЗӨВЛӨГӨӨ - Info Card */}
        <Card variant="outline" padding="medium" style={styles.tipCard}>
          <View style={styles.tipContent}>
            <Text style={styles.tipIcon}>💡</Text>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipTitle}>Зөвлөгөө</Text>
              <Text style={styles.tipText}>
                Зээлээ цагтаа төлж, зээлийн лимитээ нэмэгдүүлээрэй!
              </Text>
            </View>
          </View>
        </Card>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  
  // 🎨 HEADER - Gradient
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl + SPACING.lg,
    paddingHorizontal: SPACING.md,
    marginBottom: -SPACING.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: 4,
  },
  userName: {
    ...TEXT_STYLES.h3,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  notificationButton: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationIcon: {
    fontSize: 24,
  },
  
  // 💰 WALLET CARD
  walletCardContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  walletCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    overflow: 'hidden',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  walletLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: 8,
  },
  walletBalance: {
    ...TEXT_STYLES.h1,
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 36,
  },
  unverifiedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unverifiedIcon: {
    fontSize: 24,
  },
  creditSection: {
    marginTop: SPACING.md,
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
  creditProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginVertical: SPACING.xs,
    overflow: 'hidden',
  },
  creditProgressFill: {
    height: '100%',
    backgroundColor: COLORS.textWhite,
    borderRadius: 3,
  },
  creditAvailable: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginTop: 4,
  },
  verifyButton: {
    backgroundColor: COLORS.textWhite,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  verifyButtonText: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  // ⚡ QUICK ACTIONS
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    width: `${(100 - 2) / 2}%`,
  },
  actionCardGradient: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  actionIcon: {
    fontSize: 32,
  },
  actionTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  actionSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  
  // 📊 SECTION
  section: {
    paddingHorizontal: SPACING.md,
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
  seeAllText: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // 💳 LOAN CARD
  loanCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  loanIcon: {
    fontSize: 24,
  },
  loanNumber: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  loanAmount: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  payButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  
  // 💡 TIP CARD
  tipCard: {
    marginHorizontal: SPACING.md,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;