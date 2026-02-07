import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import LoanCard from './LoanCard';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';

const LoanList = ({
  loans,
  isLoading,
  onRefresh,
  onLoadMore,
  onLoanPress,
  hasMore,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
  const renderItem = ({ item }) => (
    <LoanCard
      loan={item}
      onPress={() => onLoanPress && onLoanPress(item)}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Зээл олдсонгүй</Text>
        <Text style={styles.emptySubtext}>
          Та зээл авах хүсэлт илгээгээгүй байна
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={loans}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={ListHeaderComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
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
  },
  emptyText: {
    ...TEXT_STYLES.h5,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    ...TEXT_STYLES.body,
    color: COLORS.textDisabled,
    textAlign: 'center',
  },
});

export default LoanList;