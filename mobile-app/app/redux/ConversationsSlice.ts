import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface LastMessage {
  id: string;
  content: string;
  type: 'text' | 'media' | 'system';
  senderId: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: ConversationUser[];
  lastMessage?: LastMessage;
  unreadCount: number;
  isTyping: boolean;
  typingUsers: string[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationsState {
  conversations: Conversation[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  isLoading: false,
  hasMore: true,
  error: null,
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const existingIndex = state.conversations.findIndex((conv) => conv.id === action.payload.id);

      if (existingIndex !== -1) {
        state.conversations[existingIndex] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
    },
    updateConversation: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<Conversation>;
      }>,
    ) => {
      const { id, updates } = action.payload;
      const conversationIndex = state.conversations.findIndex((conv) => conv.id === id);

      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          ...updates,
        };
      }
    },
    updateLastMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        lastMessage: LastMessage;
      }>,
    ) => {
      const { conversationId, lastMessage } = action.payload;
      const conversation = state.conversations.find((conv) => conv.id === conversationId);

      if (conversation) {
        conversation.lastMessage = lastMessage;
        conversation.updatedAt = lastMessage.timestamp;

        // Move to top of list
        state.conversations = [
          conversation,
          ...state.conversations.filter((conv) => conv.id !== conversationId),
        ];
      }
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find((conv) => conv.id === action.payload);
      if (conversation) {
        conversation.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find((conv) => conv.id === action.payload);
      if (conversation) {
        conversation.unreadCount = 0;
        if (conversation.lastMessage) {
          conversation.lastMessage.isRead = true;
        }
      }
    },
    setTypingStatus: (
      state,
      action: PayloadAction<{
        conversationId: string;
        userId: string;
        isTyping: boolean;
      }>,
    ) => {
      const { conversationId, userId, isTyping } = action.payload;
      const conversation = state.conversations.find((conv) => conv.id === conversationId);

      if (conversation) {
        if (isTyping) {
          if (!conversation.typingUsers.includes(userId)) {
            conversation.typingUsers.push(userId);
          }
        } else {
          conversation.typingUsers = conversation.typingUsers.filter((id) => id !== userId);
        }
        conversation.isTyping = conversation.typingUsers.length > 0;
      }
    },
    updateUserOnlineStatus: (
      state,
      action: PayloadAction<{
        userId: string;
        isOnline: boolean;
        lastSeen?: string;
      }>,
    ) => {
      const { userId, isOnline, lastSeen } = action.payload;

      state.conversations.forEach((conversation) => {
        const participant = conversation.participants.find((p) => p.id === userId);
        if (participant) {
          participant.isOnline = isOnline;
          if (lastSeen) {
            participant.lastSeen = lastSeen;
          }
        }
      });
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter((conv) => conv.id !== action.payload);
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = [];
      state.hasMore = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setConversations,
  addConversation,
  updateConversation,
  updateLastMessage,
  incrementUnreadCount,
  markAsRead,
  setTypingStatus,
  updateUserOnlineStatus,
  removeConversation,
  setHasMore,
  clearConversations,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
