import { generateAPIUrl } from '@/utils'
import { useChat } from '@ai-sdk/react';
import { fetch as expoFetch } from 'expo/fetch';
import { View, TextInput, ScrollView, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRef, useEffect } from 'react';

export default function App() {
  const { messages, error, handleInputChange, input, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: error => console.error(error, 'ERROR'),
  });

  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (error) return <Text>{error.message}</Text>;

  // Check if there are only two unique roles in the chat
  const uniqueRoles = new Set(messages.map(m => m.role));
  const showRoles = uniqueRoles.size > 2;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">GPT Chat</ThemedText>
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
            placeholder="Say something..."
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
    gap: 8,
    paddingTop: 24,
    paddingBottom: 16,
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