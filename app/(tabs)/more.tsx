import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function MoreScreen() {
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
        <ThemedText type="title">More</ThemedText>
      </ThemedView>

      {/* User Profile Section */}
      <ThemedView style={styles.profileSection}>
        <Image
          source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe&background=0a7ea4&color=fff' }}
          style={styles.avatar}
        />
        <ThemedView style={styles.profileInfo}>
          <ThemedText type="subtitle">John Doe</ThemedText>
          <ThemedText style={styles.email}>john.doe@example.com</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Chat History Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Chats</ThemedText>
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
        <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">Account Settings</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">Notifications</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <ThemedView style={styles.settingItemContent}>
            <IconSymbol size={24} name="house.fill" color="#0a7ea4" />
            <ThemedText type="defaultSemiBold">Privacy</ThemedText>
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
});
