import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/globalStyles';
import { TEXT_STYLES } from '../../styles/typography';
import { formatPhoneNumber, formatDate } from '../../utils/formatters';
import authService from '../../services/authService';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Гарах',
      'Та системээс гарах уу?',
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Гарах',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    // Validate
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Одоогийн нууц үг оруулна уу';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'Шинэ нууц үг оруулна уу';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Нууц үг хамгийн багадаа 6 тэмдэгт байна';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Нууц үг таарахгүй байна';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordErrors({});

      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      Alert.alert(
        'Амжилттай',
        'Нууц үг амжилттай солигдлоо',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowPasswordModal(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Алдаа',
        error.message || 'Нууц үг солиход алдаа гарлаа',
        [{ text: 'OK' }]
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const menuItems = [
    {
      icon: '🔒',
      title: 'Нууц үг солих',
      onPress: () => setShowPasswordModal(true),
    },
    {
      icon: '📞',
      title: 'Холбоо барих',
      onPress: () => Alert.alert('Холбоо барих', 'support@moneyapp.mn'),
    },
    {
      icon: 'ℹ️',
      title: 'Апп-ын тухай',
      onPress: () => Alert.alert('MoneyApp', 'Хувилбар 1.0.0'),
    },
    {
      icon: '🚪',
      title: 'Гарах',
      onPress: handleLogout,
      color: COLORS.error,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.headerTitle}>Профайл</Text>

        {/* User Info Card */}
        <Card style={styles.userCard} padding="large">
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>
            {user?.lastName} {user?.firstName}
          </Text>
          
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>📱 Утас:</Text>
            <Text style={styles.userInfoValue}>
              {formatPhoneNumber(user?.phoneNumber)}
            </Text>
          </View>

          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>🆔 Регистр:</Text>
            <Text style={styles.userInfoValue}>
              {user?.registerNumber}
            </Text>
          </View>

          {user?.email && (
            <View style={styles.userInfoRow}>
              <Text style={styles.userInfoLabel}>✉️ Имэйл:</Text>
              <Text style={styles.userInfoValue}>
                {user?.email}
              </Text>
            </View>
          )}

          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoLabel}>📅 Бүртгэсэн:</Text>
            <Text style={styles.userInfoValue}>
              {formatDate(user?.createdAt)}
            </Text>
          </View>

          {user?.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Баталгаажсан</Text>
            </View>
          )}
        </Card>

        {/* Menu Items */}
        <Card padding="none">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.menuTitle,
                    item.color && { color: item.color },
                  ]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* App Version */}
        <Text style={styles.versionText}>MoneyApp v1.0.0</Text>
      </ScrollView>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Нууц үг солих</Text>

            <Input
              label="Одоогийн нууц үг"
              placeholder="Одоогийн нууц үг"
              value={passwordData.currentPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, currentPassword: value })
              }
              secureTextEntry
              error={passwordErrors.currentPassword}
            />

            <Input
              label="Шинэ нууц үг"
              placeholder="Шинэ нууц үг"
              value={passwordData.newPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, newPassword: value })
              }
              secureTextEntry
              error={passwordErrors.newPassword}
            />

            <Input
              label="Шинэ нууц үг давтах"
              placeholder="Шинэ нууц үг давтах"
              value={passwordData.confirmPassword}
              onChangeText={(value) =>
                setPasswordData({ ...passwordData, confirmPassword: value })
              }
              secureTextEntry
              error={passwordErrors.confirmPassword}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Цуцлах"
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setPasswordErrors({});
                }}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="Солих"
                onPress={handleChangePassword}
                loading={changingPassword}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}
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
  userCard: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TEXT_STYLES.h2,
    color: COLORS.textWhite,
    fontWeight: '700',
  },
  userName: {
    ...TEXT_STYLES.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: SPACING.xs,
  },
  userInfoLabel: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
    width: 100,
  },
  userInfoValue: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: SPACING.md,
  },
  verifiedText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  menuTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
  },
  menuArrow: {
    ...TEXT_STYLES.h4,
    color: COLORS.textDisabled,
  },
  versionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textDisabled,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...TEXT_STYLES.h4,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default ProfileScreen;