import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface ChatHistory {
  id: string;
  user_id: string;
  title: string;
  messages: any[];
  created_at: string;
  updated_at: string;
}

interface ChatHistoryContextType {
  chatHistory: ChatHistory[];
  loading: boolean;
  error: string | null;
  createChat: (title: string, messages: any[]) => Promise<ChatHistory>;
  updateChat: (id: string, messages: any[]) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  searchChats: (query: string) => Promise<void>;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      fetchChatHistory();
    }
  }, [session]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChatHistory(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string, messages: any[]) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert([
          {
            user_id: session?.user?.id,
            title,
            messages,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setChatHistory([data, ...chatHistory]);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateChat = async (id: string, messages: any[]) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setChatHistory(chatHistory.map(chat => 
        chat.id === id ? data : chat
      ));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteChat = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setChatHistory(chatHistory.filter(chat => chat.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const searchChats = async (query: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', session?.user?.id)
        .ilike('title', `%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChatHistory(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        chatHistory,
        loading,
        error,
        createChat,
        updateChat,
        deleteChat,
        searchChats,
      }}
    >
      {children}
    </ChatHistoryContext.Provider>
  );
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  if (context === undefined) {
    throw new Error('useChatHistory must be used within a ChatHistoryProvider');
  }
  return context;
} 