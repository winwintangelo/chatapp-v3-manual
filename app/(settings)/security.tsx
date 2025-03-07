import { StyleSheet, Switch, TouchableOpacity, Alert, Platform, StatusBar, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { router, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';

export default function SecurityScreen() {
  const { isBiometricEnabled, isBiometricAvailable, toggleBiometric } = useAuth();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  // Force hide the header
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleToggleBiometric = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        t('common.error'),
        t('more.biometricNotAvailable')
      );
      return;
    }
    
    try {
      await toggleBiometric();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  return (
    <View style={styles.fullScreen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        {/* <ThemedView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="#0a7ea4" />
            <ThemedText style={styles.backText}>{t('common.back')}</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>{t('more.securitySettings')}</ThemedText>
        </ThemedView> */}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>{t('more.authentication')}</ThemedText>
          
          <ThemedView style={styles.settingItem}>
            <ThemedView style={styles.settingRow}>
              <ThemedView style={styles.settingInfo}>
                <ThemedText type="defaultSemiBold">{t('more.biometricAuth')}</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {isBiometricAvailable ? 
                    t('more.biometricAuthDescription') : 
                    t('more.biometricNotAvailable')
                  }
                </ThemedText>
              </ThemedView>
              <Switch
                value={isBiometricEnabled}
                onValueChange={handleToggleBiometric}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isBiometricEnabled ? '#0a7ea4' : '#f4f3f4'}
                disabled={!isBiometricAvailable}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  backText: {
    marginLeft: 4,
    color: '#0a7ea4',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // To offset the back button width
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
}); 