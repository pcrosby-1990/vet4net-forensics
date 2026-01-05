// src/context/ChatContext.jsx
// Persist THREAD chat state across navigation
// Day 76 - January 5, 2026

import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

const initialMessage = {
  id: 'welcome',
  text: "Hello. I'm THREAD - the base model of the L0GIC architecture. I'm here to demonstrate warmth-based AI interaction. What would you like to explore?",
  isUser: false,
  timestamp: new Date().toISOString(),
  warmth: 0.72,
};

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([initialMessage]);
  const [sessionStats, setSessionStats] = useState({
    messagesCount: 0,
    tokensUsed: 0,
    avgWarmth: 0.72,
  });

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);

    // Update stats
    setSessionStats(prev => {
      const newCount = prev.messagesCount + 1;
      const estimatedTokens = Math.ceil(message.text.length / 4);
      const newTokens = prev.tokensUsed + estimatedTokens;

      // Only update warmth for thread messages
      let newWarmth = prev.avgWarmth;
      if (!message.isUser && message.warmth) {
        const threadMsgCount = messages.filter(m => !m.isUser).length + 1;
        const warmthSum = messages
          .filter(m => !m.isUser && m.warmth)
          .reduce((sum, m) => sum + m.warmth, 0) + message.warmth;
        newWarmth = warmthSum / threadMsgCount;
      }

      return {
        messagesCount: newCount,
        tokensUsed: newTokens,
        avgWarmth: newWarmth,
      };
    });
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([initialMessage]);
    setSessionStats({
      messagesCount: 0,
      tokensUsed: 0,
      avgWarmth: 0.72,
    });
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      addMessage,
      clearChat,
      sessionStats,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext;
