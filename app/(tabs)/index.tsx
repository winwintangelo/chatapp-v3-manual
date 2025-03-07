import { generateAPIUrl } from '@/utils'
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatHistory } from '../../contexts/ChatHistoryContext';

export default function App() {
  const { messages, error, handleInputChange, input, handleSubmit, setMessages } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();
  const { createChat, updateChat } = useChatHistory();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const title = messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '');
      if (!currentChatId) {
        createChat(title, messages).then((chat: { id: string }) => {
          setCurrentChatId(chat.id);
        });
      } else {
        updateChat(currentChatId, messages);
      }
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  if (error) return <Text>{error.message}</Text>;

  // Check if there are only two unique roles in the chat
  const uniqueRoles = new Set(messages.map(m => m.role));
  const showRoles = uniqueRoles.size > 2;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{t('chat.title')}</ThemedText>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={handleNewChat}
          >
            <ThemedText style={styles.newChatText}>{t('chat.newChat')}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.scrollContainer}>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={() => {
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }
            }}
          >
            {messages.map(m => (
              <View key={m.id} style={[
                styles.messageContainer,
                m.role === 'user' ? styles.userMessageContainer : styles.assistantMessageContainer
              ]}>
                <View>
                  {showRoles && (
                    <Text style={[
                      styles.roleText,
                      m.role === 'user' ? styles.userRoleText : styles.assistantRoleText
                    ]}>{m.role}</Text>
                  )}

                  {m.reasoning && <Text style={[
                    styles.messageText,
                    m.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}>{m.reasoning}</Text>}
                 
                  <Text style={[
                    styles.messageText,
                    m.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}>{m.content}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </ThemedView>

        <ThemedView style={[styles.inputContainer, { paddingBottom: insets.bottom + 24 }]}>
          <TextInput
            style={styles.input}
            placeholder={t('chat.placeholder')}
            value={input}
            onChange={e =>
              handleInputChange({
                ...e,
                target: {
                  ...e.target,
                  value: e.nativeEvent.text,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            onSubmitEditing={e => {
              handleSubmit(e);
              e.preventDefault();
            }}
            autoFocus={true}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    paddingTop: 24,
    paddingBottom: 16,
  },
  newChatButton: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newChatText: {
    color: '#fff',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0',
  },
  assistantMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  roleText: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  userRoleText: {
    color: '#666',
  },
  assistantRoleText: {
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#333',
  },
  assistantMessageText: {
    color: '#333',
  },
  inputContainer: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});