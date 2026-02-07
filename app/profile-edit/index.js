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
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';

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
    <View style={styles.container}>
      <LinearGradient
        colors={['#F5F7FA', '#ECF0F3']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Мэдээлэл засах</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* LOCKED INDICATOR */}
          {isProfileLocked && (
            <View style={styles.lockedCard}>
              <View style={styles.lockedContent}>
                <Text style={styles.lockedIcon}>🔒</Text>
                <View style={styles.lockedTextContainer}>
                  <Text style={styles.lockedTitle}>Профайл хаагдсан</Text>
                  <Text style={styles.lockedText}>
                    Зөвхөн админ засах боломжтой. Холбоо барих: 7777-7777
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* ҮНДСЭН МЭДЭЭЛЭЛ */}
          <View style={styles.card}>
            <LinearGradient
              colors={['#FF6B9D', '#C44569']}
              style={styles.cardGrad}>
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
            </LinearGradient>
          </View>

          {/* ДАНСНЫ МЭДЭЭЛЭЛ */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>💳 Дансны мэдээлэл</Text>
              
              <Text style={styles.label}>Дансны дугаар *</Text>
              <TextInput
                style={[styles.input, isProfileLocked && styles.inputDisabled]}
                placeholder="8-16 орон"
                placeholderTextColor="#94A3B8"
                value={formData.bankAccountNumber}
                onChangeText={(text) =>
                  setFormData({ ...formData, bankAccountNumber: text })
                }
                keyboardType="numeric"
                maxLength={25}
                editable={!isProfileLocked}
              />
              
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Та iban дугаарын хамт оруулна уу.
                </Text>
              </View>
            </View>
          </View>

          {/* ЯАРАЛТАЙ ХОЛБОО */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>🚨 Яаралтай холбоо барих</Text>
              
              <Text style={styles.label}>Нэр *</Text>
              <TextInput
                style={[styles.input, isProfileLocked && styles.inputDisabled]}
                placeholder="Бүрэн нэр"
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
            </View>
          </View>

          {/* БОЛОВСРОЛ */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
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
            </View>
          </View>

          {/* АЖИЛ, ОРЛОГО */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>💼 Ажил, орлого</Text>
              
              <Text style={styles.label}>Ажил мэргэжил *</Text>
              <TextInput
                style={[styles.input, isProfileLocked && styles.inputDisabled]}
                placeholder="Жишээ: Инженер, Багш"
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
                value={formData.monthlyIncome}
                onChangeText={(text) =>
                  setFormData({ ...formData, monthlyIncome: text })
                }
                editable={!isProfileLocked}
              />
            </View>
          </View>

          {/* ХАЯГ */}
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>🏠 Хаяг мэдээлэл</Text>
              
              <Text style={styles.label}>Хот/Аймаг *</Text>
              <TextInput
                style={[styles.input, isProfileLocked && styles.inputDisabled]}
                placeholder="Жишээ: Улаанбаатар"
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
            </View>
          </View>

          {/* ACTION BUTTONS */}
          {!isProfileLocked && (
            <View style={styles.buttonContainer}>
              <Button
                title="Хадгалах"
                onPress={handleSave}
                loading={loading}
                fullWidth
                variant="gradient"
              />

              <Button
                title="Профайл хаах"
                onPress={handleLockProfile}
                loading={lockLoading}
                fullWidth
                variant="outline"
                style={styles.lockButton}
              />
            </View>
          )}

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
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  backText: {
    fontSize: 24,
    color: '#1A1A2E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    color: '#1A1A2E',
    fontWeight: '800',
  },
  
  // SCROLL VIEW
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  
  // LOCKED CARD
  lockedCard: {
    backgroundColor: '#FEE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  lockedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  lockedTextContainer: {
    flex: 1,
  },
  lockedTitle: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '700',
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 13,
    color: '#64748B',
  },
  
  // CARD
  card: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardGrad: {
    padding: 20,
  },
  cardContent: {
    backgroundColor: '#FFF',
    padding: 20,
  },
  
  // SECTION
  sectionTitle: {
    fontSize: 16,
    color: '#1A1A2E',
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionTitleWhite: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 16,
  },
  
  // LOCKED FIELD
  lockedField: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  lockedFieldLabel: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  lockedFieldValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  
  // INPUT
  label: {
    fontSize: 14,
    color: '#1A1A2E',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    color: '#1A1A2E',
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  
  // EDUCATION GRID
  educationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  educationButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
  },
  educationButtonActive: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  educationButtonDisabled: {
    opacity: 0.5,
  },
  educationButtonText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  educationButtonTextActive: {
    color: '#FFF',
  },
  
  // BUTTONS
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  lockButton: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
});

export default ProfileEditScreen;