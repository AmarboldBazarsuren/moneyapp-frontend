import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import {
  formatCurrency,
  formatDate,
  getLoanStatusColor,
  getLoanStatusText,
} from '../../utils/formatters';

const LoanCard = ({ loan, onPress }) => {
  const statusColor = getLoanStatusColor(loan.status);
  const statusText = getLoanStatusText(loan.status);

  return (
    <Card onPress={onPress} padding="medium">
      <View style={styles.header}>
        <View>
          <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
          <Text style={styles.date}>
            {formatDate(loan.createdAt)}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Зээлийн дүн:</Text>
        <Text style={styles.value}>
          {formatCurrency(loan.principalAmount)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Хүү ({loan.interestRate}%):</Text>
        <Text style={styles.valueSecondary}>
          {formatCurrency(loan.totalInterest)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.labelBold}>Нийт төлөх:</Text>
        <Text style={styles.valueBold}>
          {formatCurrency(loan.totalAmount)}
        </Text>
      </View>

      {loan.status === 'active' || loan.status === 'overdue' ? (
        <>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Үлдэгдэл:</Text>
            <Text style={[styles.valueBold, { color: COLORS.error }]}>
              {formatCurrency(loan.remainingAmount)}
            </Text>
          </View>

          {loan.penaltyAmount > 0 && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: COLORS.error }]}>
                Алданги:
              </Text>
              <Text style={[styles.value, { color: COLORS.error }]}>
                {formatCurrency(loan.penaltyAmount)}
              </Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Дуусах огноо:</Text>
            <Text style={styles.value}>
              {formatDate(loan.dueDate)}
            </Text>
          </View>
        </>
      ) : null}

      {loan.status === 'repaid' && (
        <>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, { color: COLORS.success }]}>
              Төлсөн огноо:
            </Text>
            <Text style={styles.value}>
              {formatDate(loan.repaidAt)}
            </Text>
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  loanNumber: {
    ...TEXT_STYLES.h6,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  date: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  statusText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  labelBold: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  value: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
  },
  valueSecondary: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  valueBold: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
});

export default LoanCard;