import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { COLORS, GRADIENTS, SHADOWS, RADIUS, SPACING } from '../../styles/colors';
import { TEXT_STYLES } from '../../styles/typography';

const ProfileEditScreen = () => {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    bankAccountNumber: '',
    emergencyContact: {
      name: '',
      phoneNumber: '',
      relationship: '',
    },
    educationLevel: '',
    occupation: '',
    monthlyIncome: '',
    address: {
      city: '',
      district: '',
      street: '',
      details: '',
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        bankAccountNumber: user.bankAccountNumber || '',
        emergencyContact: user.emergencyContact || {
          name: '',
          phoneNumber: '',
          relationship: '',
        },
        educationLevel: user.educationLevel || '',
        occupation: user.occupation || '',
        monthlyIncome: user.monthlyIncome || '',
        address: user.address || {
          city: '',
          district: '',
          street: '',
          details: '',
        },
      });
    }
  }, [user]);

  const educationLevels = [
    { label: 'Бага', value: 'elementary' },
    { label: 'Дунд', value: 'secondary' },
    { label: 'Бүрэн дунд', value: 'high_school' },
    { label: 'Мэргэжлийн', value: 'vocational' },
    { label: 'Дээд', value: 'bachelor' },
    { label: 'Магистр', value: 'master' },
    { label: 'Доктор', value: 'phd' },
  ];

  const handleSave = async () => {
    // Validation
    if (!formData.bankAccountNumber || formData.bankAccountNumber.length < 8) {
      Alert.alert('Алдаа', 'Дансны дугаар 8-аас дээш тэмдэгт байх ёстой');
      return;
    }

    if (!formData.emergencyContact.name || !formData.emergencyContact.phoneNumber) {
      Alert.alert('Алдаа', 'Яаралтай холбоо барих мэдээлэл бөглөнө үү');
      return;
    }

    if (formData.emergencyContact.phoneNumber.length !== 8) {
      Alert.alert('Алдаа', 'Утасны дугаар 8 оронтой байх ёстой');
      return;
    }

    if (!formData.educationLevel) {
      Alert.alert('Алдаа', 'Боловсролын түвшин сонгоно уу');
      return;
    }

    if (!formData.occupation) {
      Alert.alert('Алдаа', 'Ажил мэргэжил бөглөнө үү');
      return;
    }

    if (!formData.monthlyIncome) {
      Alert.alert('Алдаа', 'Сарын орлого бөглөнө үү');
      return;
    }

    if (!formData.address.city || !formData.address.district) {
      Alert.alert('Алдаа', 'Хот, дүүрэг бөглөнө үү');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.updateProfile(formData);
      
      if (response.success) {
        Alert.alert(
          'Амжилттай',
          'Профайл мэдээлэл амжилттай хадгалагдлаа',
          [
            {
              text: 'OK',
              onPress: async () => {
                await refreshUser();
                router.back();
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Алдаа', error.message || 'Профайл засахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleLockProfile = () => {
    Alert.alert(
      'Профайл хаах',
      'Профайлыг хаасны дараа зөвхөн админ засах боломжтой. Та итгэлтэй байна уу?',
      [
        { text: 'Цуцлах', style: 'cancel' },
        {
          text: 'Хаах',
          style: 'destructive',
          onPress: async () => {
            try {
              setLockLoading(true);
              const response = await authService.lockProfile();
              
              if (response.success) {
                Alert.alert(
                  'Амжилттай',
                  'Профайл амжилттай хаагдлаа',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        await refreshUser();
                        router.back();
                      },
                    },
                  ]
                );
              }
            } catch (error) {
              Alert.alert('Алдаа', error.message || 'Профайл хаахад алдаа гарлаа');
            } finally {
              setLockLoading(false);
            }
          },
        },
      ]
    );
  };

  const isProfileLocked = user?.profileLockedAt;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Мэдээлэл засах</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* LOCKED INDICATOR */}
        {isProfileLocked && (
          <Card variant="outline" padding="medium" style={styles.lockedCard}>
            <View style={styles.lockedContent}>
              <Text style={styles.lockedIcon}>🔒</Text>
              <View style={styles.lockedTextContainer}>
                <Text style={styles.lockedTitle}>Профайл хаагдсан</Text>
                <Text style={styles.lockedText}>
                  Зөвхөн админ засах боломжтой. Холбоо барих: 7777-7777
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* ҮНДСЭН МЭДЭЭЛЭЛ */}
        <Card variant="gradient" gradientColors={GRADIENTS.primary} padding="medium">
          <Text style={styles.sectionTitleWhite}>Үндсэн мэдээлэл (Засах боломжгүй)</Text>
          
          <View style={styles.lockedField}>
            <Text style={styles.lockedFieldLabel}>Овог</Text>
            <Text style={styles.lockedFieldValue}>{user?.lastName}</Text>
          </View>

          <View style={styles.lockedField}>
            <Text style={styles.lockedFieldLabel}>Нэр</Text>
            <Text style={styles.lockedFieldValue}>{user?.firstName}</Text>
          </View>

          <View style={styles.lockedField}>
            <Text style={styles.lockedFieldLabel}>Регистр</Text>
            <Text style={styles.lockedFieldValue}>{user?.registerNumber}</Text>
          </View>

          <View style={styles.lockedField}>
            <Text style={styles.lockedFieldLabel}>Утас</Text>
            <Text style={styles.lockedFieldValue}>{user?.phoneNumber}</Text>
          </View>
        </Card>

        {/* ДАНСНЫ МЭДЭЭЛЭЛ */}
        <Card padding="medium">
          <Text style={styles.sectionTitle}>💳 Дансны мэдээлэл</Text>
          
          <Text style={styles.label}>Дансны дугаар *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="8-16 орон"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.bankAccountNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, bankAccountNumber: text })
            }
            keyboardType="numeric"
            maxLength={16}
            editable={!isProfileLocked}
          />
          
          <Card variant="outline" padding="small" style={styles.infoBox}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Админ дансны дугаар өөрчлөх боломжтой
            </Text>
          </Card>
        </Card>

        {/* ЯАРАЛТАЙ ХОЛБОО */}
        <Card padding="medium">
          <Text style={styles.sectionTitle}>🚨 Яаралтай холбоо барих</Text>
          
          <Text style={styles.label}>Нэр *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Бүрэн нэр"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.emergencyContact.name}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                emergencyContact: { ...formData.emergencyContact, name: text },
              })
            }
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Утасны дугаар *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="8 орон"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.emergencyContact.phoneNumber}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  phoneNumber: text.replace(/[^0-9]/g, ''),
                },
              })
            }
            keyboardType="phone-pad"
            maxLength={8}
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Хамаарал</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: Эхнэр, Эцэг, Ах/Эгч"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.emergencyContact.relationship}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                emergencyContact: {
                  ...formData.emergencyContact,
                  relationship: text,
                },
              })
            }
            editable={!isProfileLocked}
          />
        </Card>

        {/* БОЛОВСРОЛ */}
        <Card padding="medium">
          <Text style={styles.sectionTitle}>🎓 Боловсролын түвшин *</Text>
          
          <View style={styles.educationGrid}>
            {educationLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.educationButton,
                  formData.educationLevel === level.value &&
                    styles.educationButtonActive,
                  isProfileLocked && styles.educationButtonDisabled,
                ]}
                onPress={() =>
                  !isProfileLocked &&
                  setFormData({ ...formData, educationLevel: level.value })
                }
                disabled={isProfileLocked}>
                <Text
                  style={[
                    styles.educationButtonText,
                    formData.educationLevel === level.value &&
                      styles.educationButtonTextActive,
                  ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* АЖИЛ, ОРЛОГО */}
        <Card padding="medium">
          <Text style={styles.sectionTitle}>💼 Ажил, орлого</Text>
          
          <Text style={styles.label}>Ажил мэргэжил *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: Инженер, Багш"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.occupation}
            onChangeText={(text) =>
              setFormData({ ...formData, occupation: text })
            }
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Сарын орлого *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: 1,000,000₮ - 2,000,000₮"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.monthlyIncome}
            onChangeText={(text) =>
              setFormData({ ...formData, monthlyIncome: text })
            }
            editable={!isProfileLocked}
          />
        </Card>

        {/* ХАЯГ */}
        <Card padding="medium">
          <Text style={styles.sectionTitle}>🏠 Хаяг мэдээлэл</Text>
          
          <Text style={styles.label}>Хот/Аймаг *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: Улаанбаатар"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.address.city}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, city: text },
              })
            }
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Дүүрэг/Сум *</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: Сүхбаатар"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.address.district}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, district: text },
              })
            }
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Гудамж/Хороолол</Text>
          <TextInput
            style={[styles.input, isProfileLocked && styles.inputDisabled]}
            placeholder="Жишээ: 1-р хороо"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.address.street}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, street: text },
              })
            }
            editable={!isProfileLocked}
          />

          <Text style={styles.label}>Дэлгэрэнгүй хаяг</Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              isProfileLocked && styles.inputDisabled,
            ]}
            placeholder="Байр, тоот гэх мэт"
            placeholderTextColor={COLORS.textTertiary}
            value={formData.address.details}
            onChangeText={(text) =>
              setFormData({
                ...formData,
                address: { ...formData.address, details: text },
              })
            }
            multiline
            numberOfLines={3}
            editable={!isProfileLocked}
          />
        </Card>

        {/* ACTION BUTTONS */}
        {!isProfileLocked && (
          <View style={styles.buttonContainer}>
            <Button
              title="Хадгалах"
              variant="gradient"
              onPress={handleSave}
              loading={loading}
              fullWidth
            />

            <Button
              title="Профайл хаах"
              variant="outline"
              onPress={handleLockProfile}
              loading={lockLoading}
              fullWidth
              style={styles.lockButton}
            />
          </View>
        )}

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
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    ...TEXT_STYLES.h3,
    color: COLORS.primary,
  },
  headerTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  
  // SCROLL VIEW
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  
  // LOCKED CARD
  lockedCard: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  lockedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  lockedTextContainer: {
    flex: 1,
  },
  lockedTitle: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.error,
    fontWeight: '700',
    marginBottom: 4,
  },
  lockedText: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },
  
  // SECTION
  sectionTitle: {
    ...TEXT_STYLES.h5,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  sectionTitleWhite: {
    ...TEXT_STYLES.h5,
    color: COLORS.textWhite,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  
  // LOCKED FIELD
  lockedField: {
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  lockedFieldLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.textWhite,
    opacity: 0.8,
    marginBottom: 4,
  },
  lockedFieldValue: {
    ...TEXT_STYLES.bodyLarge,
    color: COLORS.textWhite,
    fontWeight: '600',
  },
  
  // INPUT
  label: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
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
  inputDisabled: {
    backgroundColor: COLORS.backgroundSecondary,
    opacity: 0.6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // INFO BOX
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.info,
    borderWidth: 2,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  infoText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  
  // EDUCATION GRID
  educationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  educationButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  educationButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  educationButtonDisabled: {
    opacity: 0.5,
  },
  educationButtonText: {
    ...TEXT_STYLES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  educationButtonTextActive: {
    color: COLORS.textWhite,
  },
  
  // BUTTONS
  buttonContainer: {
    gap: SPACING.sm,
  },
  lockButton: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
});

export default ProfileEditScreen;