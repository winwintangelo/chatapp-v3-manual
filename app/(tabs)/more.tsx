import { StyleSheet, Image, Platform, TouchableOpacity, Alert, TextInput, ActivityIndicator, Switch } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useChatHistory } from '../../contexts/ChatHistoryContext';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useState } from 'react';

// Import the images
const PLACEHOLDER_AVATAR = require('@/assets/images/Profile_avatar_placeholder_large.png');
const APP_BACKGROUND = require('@/assets/images/app-background-small.png');

export default function MoreScreen() {
  const { 
    session, 
    signOut,
    isBiometricEnabled,
    isBiometricAvailable,
    toggleBiometric
  } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const { chatHistory, loading, searchChats } = useChatHistory();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    searchChats(text);
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={APP_BACKGROUND}
          style={styles.headerImage}
          resizeMode="cover"
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('more.title')}</ThemedText>
      </ThemedView>

      {/* User Profile Section */}
      <ThemedView style={styles.profileSection}>
        <Image
          source={session?.user?.email ? 
            { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email)}&background=0a7ea4&color=fff` } : 
            PLACEHOLDER_AVATAR
          }
          style={styles.avatar}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedText type="subtitle">{session?.user?.email?.split('@')[0] || 'User'}</ThemedText>
          <ThemedText style={styles.email}>{session?.user?.email || t('more.guestUser')}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Chat History Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('more.recentChats')}</ThemedText>
        
        {/* Search Input */}
        <ThemedView style={styles.searchContainer}>
          <IconSymbol size={20} name="magnifyingglass" color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('more.searchChats')}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </ThemedView>

        {loading ? (
          <ActivityIndicator size="large" color="#0a7ea4" style={styles.loadingIndicator} />
        ) : chatHistory.length === 0 ? (
          <ThemedText style={styles.noChats}>{t('more.noChats')}</ThemedText>
        ) : (
          chatHistory.map(chat => (
            <TouchableOpacity 
              key={chat.id} 
              style={styles.chatItem}
              onPress={() => handleChatPress(chat.id)}
            >
              <ThemedView style={styles.chatItemContent}>
                <IconSymbol size={24} name="bubble.left.fill" color="#0a7ea4" />
                <ThemedView style={styles.chatItemText}>
                  <ThemedText type="defaultSemiBold">{chat.title}</ThemedText>
                  <ThemedText 
                    style={styles.chatPreview}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {chat.messages[chat.messages.length - 1]?.content || t('more.noMessages')}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.chatTime}>
                  {new Date(chat.updated_at).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))
        )}
      </ThemedView>

      {/* Settings Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>{t('more.settings')}</ThemedText>
        

          
        {/* Security Settings */}
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={() => router.push('/(settings)/security' as any)}>
          <ThemedView style={styles.settingItemContent}>
            <ThemedView style={styles.settingIconContainer}>
              <IconSymbol size={24} name="lock.shield" color="#0a7ea4" />
            </ThemedView>
            <ThemedView style={styles.settingInfo}>
              <ThemedText type="defaultSemiBold">{t('more.securitySettings')}</ThemedText>
              <ThemedText style={styles.settingDescription}>
                {t('more.securitySettingsDescription')}
              </ThemedText>
            </ThemedView>
            <IconSymbol size={20} name="chevron.right" color="#666" />
          </ThemedView>
        </TouchableOpacity>

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
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
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
    lineHeight: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  noChats: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  noMessages: {
    color: '#999',
  },
  settingIconContainer: {
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
});
