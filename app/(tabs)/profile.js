import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../hooks/useAuth';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, wallet, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      '⚠️ Гарах',
      'Та гарахдаа итгэлтэй байна уу?',
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

  const menuSections = [
    {
      title: '💼 Миний мэдээлэл',
      items: [
        {
          icon: '👤',
          title: 'Хувийн мэдээлэл',
          subtitle: 'Нэр, утас, имэйл засах',
          color: '#FF6B9D',
          onPress: () => router.push('/profile-edit'),  // 🔧 ЗАСВАРЛАСАН
        },
        {
          icon: '✓',
          title: 'Баталгаажуулалт',
          subtitle: wallet?.isEmongolaVerified ? 'Баталгаажсан' : 'Баталгаажаагүй',
          color: wallet?.isEmongolaVerified ? '#6BCF7F' : '#FFD93D',
          onPress: () => router.push('/(tabs)/wallet'),
        },
      ],
    },
    {
      title: '📊 Зээлийн мэдээлэл',
      items: [
        {
          icon: '💰',
          title: 'Зээлийн түүх',
          subtitle: `${wallet?.loanHistory || 0} зээл`,
          color: '#4ECDC4',
          onPress: () => router.push('/(tabs)/loans'),
        },
        {
          icon: '⭐',
          title: 'Зээлийн оноо',
          subtitle: `${wallet?.creditScore || 0} оноо`,
          color: '#FFD93D',
          onPress: () => {},
        },
      ],
    },
    {
      title: '💸 Гүйлгээ',
      items: [
        {
          icon: '📋',
          title: 'Татлагын түүх',
          subtitle: 'Миний мөнгө татах түүх',
          color: '#6BCF7F',
          onPress: () => router.push('/withdrawal-history'),  // 🔧 ЗАСВАРЛАСАН
        },
      ],
    },
    {
      title: '⚙️ Тохиргоо',
      items: [
        {
          icon: '🔔',
          title: 'Мэдэгдэл',
          subtitle: 'Мэдэгдлийн тохиргоо',
          color: '#5DADE2',
          onPress: () => {},
        },
        {
          icon: '🔒',
          title: 'Нууцлал',
          subtitle: 'Нууцлалын бодлого',
          color: '#BB6BD9',
          onPress: () => {},
        },
        {
          icon: '❓',
          title: 'Тусламж',
          subtitle: 'Түгээмэл асуулт хариулт',
          color: '#FF8C42',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F7FA', '#ECF0F3']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* PROFILE HEADER */}
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={['#FF6B9D', '#C44569']}
              style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Text>
            </LinearGradient>

            <Text style={styles.userName}>
              {user?.lastName} {user?.firstName}
            </Text>
            
            <View style={styles.userInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📧</Text>
                <Text style={styles.infoText}>{user?.email || 'Имэйл байхгүй'}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📱</Text>
                <Text style={styles.infoText}>{user?.phoneNumber}</Text>
              </View>
            </View>

            {wallet?.isEmongolaVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedLabel}>Баталгаажсан</Text>
              </View>
            )}
          </View>

          {/* STATS CARDS */}
          <View style={styles.statsGrid}>
            <View style={styles.statCardSmall}>
              <LinearGradient
                colors={['#4ECDC4', '#38A3A5']}
                style={styles.statCardGrad}>
                <Text style={styles.statCardIcon}>💳</Text>
                <Text style={styles.statCardValue}>
                  {wallet?.loanHistory || 0}
                </Text>
                <Text style={styles.statCardLabel}>Нийт зээл</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCardSmall}>
              <LinearGradient
                colors={['#FFD93D', '#FF8C42']}
                style={styles.statCardGrad}>
                <Text style={styles.statCardIcon}>⭐</Text>
                <Text style={styles.statCardValue}>
                  {wallet?.creditScore || 0}
                </Text>
                <Text style={styles.statCardLabel}>Зээлийн оноо</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCardSmall}>
              <LinearGradient
                colors={['#6BCF7F', '#4CAF50']}
                style={styles.statCardGrad}>
                <Text style={styles.statCardIcon}>💰</Text>
                <Text style={styles.statCardValue}>
                  {wallet?.creditLimit || 0}₮
                </Text>
                <Text style={styles.statCardLabel}>Зээлийн лимит</Text>
              </LinearGradient>
            </View>
          </View>

          {/* MENU SECTIONS */}
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.menuItem,
                      itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}>
                    
                    <View style={styles.menuItemLeft}>
                      <View
                        style={[
                          styles.menuIcon,
                          { backgroundColor: `${item.color}15` },
                        ]}>
                        <Text style={styles.menuIconText}>{item.icon}</Text>
                      </View>
                      
                      <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>{item.title}</Text>
                        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>

                    <Text style={styles.menuArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#FF6B6B', '#E74C3C']}
              style={styles.logoutGrad}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Гарах</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* APP VERSION */}
          <Text style={styles.version}>MoneyApp v1.0.0</Text>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#6BCF7F',
  },
  verifiedLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6BCF7F',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCardSmall: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardGrad: {
    padding: 16,
    alignItems: 'center',
  },
  statCardIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Menu Sections
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconText: {
    fontSize: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  menuArrow: {
    fontSize: 18,
    color: '#CBD5E1',
  },

  // Logout Button
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutGrad: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // Version
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
});

export default ProfileScreen;