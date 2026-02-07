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
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { useLoans } from '../../hooks/useLoans';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Сайн байна уу,</Text>
            <Text style={styles.userName}>
              {user?.lastName} {user?.firstName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {}}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Card */}
        <Card style={styles.walletCard} padding="large">
          <View style={styles.walletHeader}>
            <Text style={styles.walletLabel}>Хэтэвчний үлдэгдэл</Text>
            {!wallet?.isVerified && (
              <View style={styles.unverifiedBadge}>
                <Text style={styles.unverifiedText}>Баталгаажаагүй</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.walletBalance}>
            {formatCurrency(wallet?.balance || 0)}
          </Text>

          {wallet?.isVerified ? (
            <View style={styles.creditInfo}>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Зээлийн лимит:</Text>
                <Text style={styles.creditValue}>
                  {formatCurrency(wallet?.creditLimit || 0)}
                </Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Боломжит:</Text>
                <Text style={styles.creditValueAvailable}>
                  {formatCurrency(wallet?.availableCredit || 0)}
                </Text>
              </View>
            </View>
          ) : (
            <Button
              title="Хэтэвч баталгаажуулах (3,000₮)"
              onPress={() => router.push('/(tabs)/wallet')}
              variant="outline"
              size="small"
              style={styles.verifyButton}
            />
          )}
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/loan-request')}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>💰</Text>
            </View>
            <Text style={styles.actionText}>Зээл авах</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/loans')}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📊</Text>
            </View>
            <Text style={styles.actionText}>Миний зээл</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/wallet')}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>💳</Text>
            </View>
            <Text style={styles.actionText}>Хэтэвч</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/profile')}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>👤</Text>
            </View>
            <Text style={styles.actionText}>Профайл</Text>
          </TouchableOpacity>
        </View>

        {/* Active Loans */}
        {activeLoans && activeLoans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Идэвхтэй зээлүүд</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/loans')}>
                <Text style={styles.seeAllText}>Бүгдийг харах →</Text>
              </TouchableOpacity>
            </View>

            {activeLoans.slice(0, 2).map((loan) => (
              <Card
                key={loan._id}
                onPress={() => router.push(`/loan-detail/${loan._id}`)}
                padding="medium">
                <View style={styles.loanRow}>
                  <View>
                    <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
                    <Text style={styles.loanAmount}>
                      {formatCurrency(loan.remainingAmount)}
                    </Text>
                  </View>
                  <Button
                    title="Төлөх"
                    onPress={() => router.push(`/loan-detail/${loan._id}`)}
                    variant="primary"
                    size="small"
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Info Cards */}
        <Card style={styles.infoCard} padding="medium">
          <Text style={styles.infoTitle}>💡 Зөвлөгөө</Text>
          <Text style={styles.infoText}>
            Зээлээ цагтаа төлж, зээлийн лимитээ нэмэгдүүлээрэй!
          </Text>
        </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  walletCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  walletLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  unverifiedBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  unverifiedText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  walletBalance: {
    ...TEXT_STYLES.h1,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  creditInfo: {
    marginTop: SPACING.sm,
  },
  creditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs / 2,
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
  creditValueAvailable: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  verifyButton: {
    marginTop: SPACING.sm,
    borderColor: COLORS.textWhite,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  actionCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
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
  seeAllText: {
    ...TEXT_STYLES.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanNumber: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  loanAmount: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
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
  },
});

export default HomeScreen;