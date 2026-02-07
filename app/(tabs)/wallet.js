import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getTransactionTypeText,
} from '../../utils/formatters';

const WalletScreen = () => {
  const { wallet } = useAuth();
  const {
    transactions,
    isLoading,
    refresh,
    verifyWallet,
    loadMore,
    hasMore,
  } = useWallet();

  const [verifying, setVerifying] = useState(false);

  const handleVerifyWallet = async () => {
    Alert.alert(
      'Хэтэвч баталгаажуулах',
      'Та 3,000₮ төлж хэтэвчээ баталгаажуулах уу?',
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Төлөх',
          onPress: async () => {
            try {
              setVerifying(true);
              const response = await verifyWallet();
              
              if (response.success) {
                Alert.alert(
                  'Амжилттай',
                  'Баталгаажуулалтын төлбөр үүслээ. QPay-р төлнө үү.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              Alert.alert(
                'Алдаа',
                error.message || 'Алдаа гарлаа',
                [{ text: 'OK' }]
              );
            } finally {
              setVerifying(false);
            }
          },
        },
      ]
    );
  };

  const renderTransaction = (transaction) => {
    const isIncome = ['loan_disbursement', 'deposit'].includes(transaction.type);
    const amount = isIncome ? `+${formatCurrency(transaction.amount)}` : `-${formatCurrency(transaction.amount)}`;
    const amountColor = isIncome ? COLORS.success : COLORS.error;

    return (
      <Card key={transaction._id} padding="medium">
        <View style={styles.transactionRow}>
          <View style={styles.transactionLeft}>
            <Text style={styles.transactionType}>
              {getTransactionTypeText(transaction.type)}
            </Text>
            <Text style={styles.transactionDate}>
              {formatDate(transaction.createdAt, true)}
            </Text>
          </View>
          <Text style={[styles.transactionAmount, { color: amountColor }]}>
            {amount}
          </Text>
        </View>
        
        {transaction.description && (
          <Text style={styles.transactionDescription}>
            {transaction.description}
          </Text>
        )}
      </Card>
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
        {/* Header */}
        <Text style={styles.headerTitle}>Хэтэвч</Text>

        {/* Balance Card */}
        <Card style={styles.balanceCard} padding="large">
          <Text style={styles.balanceLabel}>Үлдэгдэл</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(wallet?.balance || 0)}
          </Text>

          {!wallet?.isVerified ? (
            <View style={styles.unverifiedContainer}>
              <View style={styles.warningBox}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningText}>
                  Хэтэвч баталгаажаагүй байна
                </Text>
              </View>
              <Button
                title="Баталгаажуулах (3,000₮)"
                onPress={handleVerifyWallet}
                loading={verifying}
                fullWidth
                style={styles.verifyButton}
              />
            </View>
          ) : (
            <View style={styles.creditContainer}>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Зээлийн лимит:</Text>
                <Text style={styles.creditValue}>
                  {formatCurrency(wallet?.creditLimit || 0)}
                </Text>
              </View>
              <View style={styles.creditRow}>
                <Text style={styles.creditLabel}>Ашигласан:</Text>
                <Text style={styles.creditValue}>
                  {formatCurrency((wallet?.totalBorrowed || 0) - (wallet?.totalRepaid || 0))}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.creditRow}>
                <Text style={styles.creditLabelBold}>Боломжит:</Text>
                <Text style={styles.creditValueBold}>
                  {formatCurrency(wallet?.availableCredit || 0)}
                </Text>
              </View>
            </View>
          )}
        </Card>

        {/* Statistics */}
        {wallet?.isVerified && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatCurrency(wallet?.totalBorrowed || 0)}
              </Text>
              <Text style={styles.statLabel}>Нийт авсан</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatCurrency(wallet?.totalRepaid || 0)}
              </Text>
              <Text style={styles.statLabel}>Нийт төлсөн</Text>
            </View>
          </View>
        )}

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Гүйлгээний түүх</Text>
          
          {transactions.length === 0 ? (
            <Card padding="large">
              <Text style={styles.emptyText}>Гүйлгээ олдсонгүй</Text>
            </Card>
          ) : (
            transactions.map(renderTransaction)
          )}
        </View>
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
  headerTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    ...TEXT_STYLES.h1,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  unverifiedContainer: {
    marginTop: SPACING.md,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
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
  },
  creditContainer: {
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
  creditLabelBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  creditValueBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.textWhite,
    opacity: 0.3,
    marginVertical: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs / 2,
    alignItems: 'center',
  },
  statValue: {
    ...TEXT_STYLES.h4,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SPACING.xs / 2,
  },
  statLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs / 2,
  },
  transactionDate: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    ...TEXT_STYLES.bodyLarge,
    fontWeight: '700',
  },
  transactionDescription: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default WalletScreen;