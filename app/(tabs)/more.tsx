import { StyleSheet, Image, Platform, TouchableOpacity, Alert } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function MoreScreen() {
  const { session, signOut } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  const handleLanguageChange = async (language: string) => {
    try {
      await setLanguage(language);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('more.title')}</ThemedText>
      </ThemedView>

      {/* User Profile Section */}
      <ThemedView style={styles.profileSection}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.email || 'User')}&background=0a7ea4&color=fff` }}
          style={styles.avatar}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedText type="subtitle">{session?.user?.email?.split('@')[0] || 'User'}</ThemedText>
          <ThemedText style={styles.email}>{session?.user?.email}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Chat History Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('more.recentChats')}</ThemedText>
        <TouchableOpacity style={styles.chatItem}>
          <ThemedView style={styles.chatItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedView style={styles.chatItemText}>
              <ThemedText type="defaultSemiBold">General Chat</ThemedText>
              <ThemedText style={styles.chatPreview}>Last message preview...</ThemedText>
            </ThemedView>
            <ThemedText style={styles.chatTime}>2h ago</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatItem}>
          <ThemedView style={styles.chatItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedView style={styles.chatItemText}>
              <ThemedText type="defaultSemiBold">Code Review</ThemedText>
              <ThemedText style={styles.chatPreview}>Last message preview...</ThemedText>
            </ThemedView>
            <ThemedText style={styles.chatTime}>1d ago</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatItem}>
          <ThemedView style={styles.chatItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedView style={styles.chatItemText}>
              <ThemedText type="defaultSemiBold">Project Planning</ThemedText>
              <ThemedText style={styles.chatPreview}>Last message preview...</ThemedText>
            </ThemedView>
            <ThemedText style={styles.chatTime}>2d ago</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      {/* Settings Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('more.settings')}</ThemedText>
        
        {/* Language Selection */}
        <ThemedView style={styles.languageSection}>
          <ThemedText type="defaultSemiBold" style={styles.languageTitle}>{t('more.language')}</ThemedText>
          <ThemedView style={styles.languageOptions}>
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'en' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('en')}>
              <ThemedText style={[styles.languageText, currentLanguage === 'en' && styles.languageTextActive]}>
                {t('more.languages.en')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'zh' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('zh')}>
              <ThemedText style={[styles.languageText, currentLanguage === 'zh' && styles.languageTextActive]}>
                {t('more.languages.zh')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'es' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('es')}>
              <ThemedText style={[styles.languageText, currentLanguage === 'es' && styles.languageTextActive]}>
                {t('more.languages.es')}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.languageOption, currentLanguage === 'fr' && styles.languageOptionActive]}
              onPress={() => handleLanguageChange('fr')}>
              <ThemedText style={[styles.languageText, currentLanguage === 'fr' && styles.languageTextActive]}>
                {t('more.languages.fr')}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">{t('more.accountSettings')}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">{t('more.notifications')}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">{t('more.privacy')}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, styles.signOutItem]} onPress={handleSignOut}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="rectangle.portrait.and.arrow.right" color="#ff3b30" />
            <ThemedText type="defaultSemiBold" style={styles.signOutText}>{t('more.signOut')}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  chatItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatItemText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  chatPreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutItem: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  signOutText: {
    color: '#ff3b30',
  },
  languageSection: {
    marginBottom: 16,
  },
  languageTitle: {
    marginBottom: 8,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  languageOptionActive: {
    backgroundColor: '#007AFF',
  },
  languageText: {
    fontSize: 14,
    color: '#333',
  },
  languageTextActive: {
    color: '#fff',
  },
});
