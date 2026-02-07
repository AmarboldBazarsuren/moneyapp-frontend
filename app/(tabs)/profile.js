import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, SPACING } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';
import { formatDate } from '../../utils/formatters';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, changePassword: changePasswordAPI } = useAuth();
  
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Системээс гарах',
      'Та системээс гарахдаа итгэлтэй байна уу?',
      [
        { text: 'Үгүй', style: 'cancel' },
        {
          text: 'Тийм',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Алдаа', 'Бүх талбарыг бөглөнө үү');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Алдаа', 'Шинэ нууц үг 6-аас дээш тэмдэгт байх ёстой');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Алдаа', 'Шинэ нууц үг таарахгүй байна');
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await changePasswordAPI(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        Alert.alert('Амжилттай', 'Нууц үг амжилттай солигдлоо');
        setChangePasswordModalVisible(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      Alert.alert('Алдаа', error.message || 'Нууц үг солиход алдаа гарлаа');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = () => {
    if (!user?.firstName && !user?.lastName) return '?';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${lastInitial}${firstInitial}`.toUpperCase();
  };

  const menuItems = [
    {
      icon: '📝',
      title: 'Мэдээлэл оруулах',
      subtitle: user?.profileCompleted ? 'Бүрэн бөглөсөн' : 'Дутуу байна',
      badge: !user?.profileCompleted,
      badgeText: 'Бөглөх',
      onPress: () => router.push('/profile-edit'),
      gradient: GRADIENTS.primary,
    },
    {
      icon: '🔐',
      title: 'Нууц үг солих',
      subtitle: 'Нууц үгээ өөрчлөх',
      onPress: () => setChangePasswordModalVisible(true),
      gradient: GRADIENTS.ocean,
    },
    {
      icon: '📞',
      title: 'Холбоо барих',
      subtitle: 'Тусламж хэрэгтэй юу?',
      onPress: () => Alert.alert('Холбоо барих', 'Утас: 7777-7777'),
      gradient: GRADIENTS.forest,
    },
    {
      icon: 'ℹ️',
      title: 'Апп-ын тухай',
      subtitle: 'Хувилбар 1.0.0',
      onPress: () => Alert.alert('MoneyApp', 'Хувилбар 1.0.0\n© 2026'),
      gradient: GRADIENTS.sunset,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* 🎨 PROFILE HEADER - Gradient with Glassmorphism */}
        <LinearGradient
          colors={GRADIENTS.primaryVertical}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}>
          
          {/* Avatar with glass effect */}
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.avatarGlass}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials()}</Text>
              </View>
              {user?.profileCompleted && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>
            {user?.lastName} {user?.firstName}
          </Text>
          
          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>
            <LinearGradient
              colors={
                user?.profileCompleted
                  ? ['rgba(16,185,129,0.8)', 'rgba(5,150,105,0.8)']
                  : ['rgba(245,158,11,0.8)', 'rgba(217,119,6,0.8)']
              }
              style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {user?.profileCompleted ? '✅ Бүрэн бөглөсөн' : '⚠️ Дутуу байна'}
              </Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* 📊 USER INFO CARDS - Glass cards */}
        <View style={styles.infoCardsContainer}>
          <Card variant="glass" padding="medium" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Text style={styles.infoIcon}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Утасны дугаар</Text>
                <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
              </View>
            </View>
          </Card>

          <Card variant="glass" padding="medium" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Text style={styles.infoIcon}>🆔</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Регистр</Text>
                <Text style={styles.infoValue}>
                  {user?.registerNumber || 'Бөглөөгүй'}
                </Text>
              </View>
            </View>
          </Card>

          {user?.email && (
            <Card variant="glass" padding="medium" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.infoIcon}>✉️</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>И-мэйл</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
              </View>
            </Card>
          )}

          {user?.occupation && (
            <Card variant="glass" padding="medium" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.infoIcon}>💼</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ажил мэргэжил</Text>
                  <Text style={styles.infoValue}>{user.occupation}</Text>
                </View>
              </View>
            </Card>
          )}

          {user?.monthlyIncome && (
            <Card variant="glass" padding="medium" style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.infoIcon}>💰</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Сарын орлого</Text>
                  <Text style={styles.infoValue}>{user.monthlyIncome}</Text>
                </View>
              </View>
            </Card>
          )}

          <Card variant="glass" padding="medium" style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Бүртгүүлсэн огноо</Text>
                <Text style={styles.infoValue}>
                  {formatDate(user?.createdAt)}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 🎯 MENU ITEMS - Premium cards */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              activeOpacity={0.85}
              style={styles.menuItemContainer}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.menuItemGradient}>
                
                <View style={styles.menuItemContent}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIconContainer}>
                      <Text style={styles.menuIcon}>{item.icon}</Text>
                    </View>
                    <View>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  
                  {item.badge ? (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badgeText}</Text>
                    </View>
                  ) : (
                    <Text style={styles.menuArrow}>›</Text>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 🚪 LOGOUT BUTTON */}
        <Button
          title="Системээс гарах"
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        />

        {/* Bottom spacing */}
        <View style={{ height: SPACING.xl }} />
      </ScrollView>

      {/* 🔐 CHANGE PASSWORD MODAL */}
      <Modal
        visible={changePasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePasswordModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Нууц үг солих</Text>
              <TouchableOpacity
                onPress={() => setChangePasswordModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Одоогийн нууц үг"
              placeholderTextColor={COLORS.textTertiary}
              value={passwordData.currentPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, currentPassword: text })
              }
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Шинэ нууц үг (6+ тэмдэгт)"
              placeholderTextColor={COLORS.textTertiary}
              value={passwordData.newPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, newPassword: text })
              }
              secureTextEntry
            />

            <TextInput
              style={styles.input}
              placeholder="Шинэ нууц үг дахин"
              placeholderTextColor={COLORS.textTertiary}
              value={passwordData.confirmPassword}
              onChangeText={(text) =>
                setPasswordData({ ...passwordData, confirmPassword: text })
              }
              secureTextEntry
            />

            <Button
              title="Хадгалах"
              variant="gradient"
              onPress={handleChangePassword}
              loading={passwordLoading}
              fullWidth
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: SPACING.xl,
  },
  
  // HEADER GRADIENT
  headerGradient: {
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    marginBottom: -SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarGlass: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    ...SHADOWS.large,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...TEXT_STYLES.display2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  verifiedIcon: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    ...TEXT_STYLES.h2,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statusBadgeContainer: {
    marginTop: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  statusBadgeText: {
    ...TEXT_STYLES.body,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  
  // INFO CARDS
  infoCardsContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  infoCard: {
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  
  // MENU SECTION
  menuSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  menuItemContainer: {
    marginBottom: SPACING.sm,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItemGradient: {
    padding: SPACING.md,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: 4,
  },
  menuSubtitle: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    opacity: 0.9,
  },
  menuBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
  },
  menuBadgeText: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
    fontWeight: '700',
  },
  menuArrow: {
    ...TEXT_STYLES.h3,
    color: COLORS.textWhite,
    fontWeight: '300',
  },
  
  // LOGOUT BUTTON
  logoutButton: {
    marginHorizontal: SPACING.md,
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  
  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    ...TEXT_STYLES.h4,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  modalClose: {
    ...TEXT_STYLES.h4,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  input: {
    ...TEXT_STYLES.body,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
});

export default ProfileScreen;