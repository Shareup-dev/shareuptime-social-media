import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Message interfaces
interface MessageMedia {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name?: string;
  size?: number;
  thumbnail?: string;
}

interface MessageUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface Message {
  id: string;
  conversationId: string;
  sender: MessageUser;
  recipient: MessageUser;
  content?: string;
  media?: MessageMedia[];
  type: 'text' | 'media' | 'system';
  isRead: boolean;
  isDelivered: boolean;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  currentConversationId: string | null;
}

const initialState: MessagesState = {
  messages: [],
  isLoading: false,
  hasMore: true,
  error: null,
  currentConversationId: null,
};

const messagesSlice = createSlice({
  name: 'messages',
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
    setCurrentConversationId: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
      if (action.payload) {
        // Clear messages when switching conversations
        state.messages = [];
        state.hasMore = true;
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const existingIndex = state.messages.findIndex(msg => msg.id === action.payload.id);
      if (existingIndex === -1) {
        state.messages.unshift(action.payload);
      } else {
        state.messages[existingIndex] = action.payload;
      }
    },
    addMessages: (state, action: PayloadAction<Message[]>) => {
      const newMessages = action.payload.filter(
        newMsg => !state.messages.some(existingMsg => existingMsg.id === newMsg.id)
      );
      state.messages.push(...newMessages);
      state.isLoading = false;
    },
    updateMessage: (state, action: PayloadAction<{ id: string; updates: Partial<Message> }>) => {
      const { id, updates } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === id);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
    markAsRead: (state, action: PayloadAction<string[]>) => {
      const messageIds = action.payload;
      state.messages.forEach(msg => {
        if (messageIds.includes(msg.id)) {
          msg.isRead = true;
        }
      });
    },
    markAsDelivered: (state, action: PayloadAction<string[]>) => {
      const messageIds = action.payload;
      state.messages.forEach(msg => {
        if (messageIds.includes(msg.id)) {
          msg.isDelivered = true;
        }
      });
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
      state.hasMore = true;
      state.error = null;
      state.currentConversationId = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentConversationId,
  setMessages,
  addMessage,
  addMessages,
  updateMessage,
  removeMessage,
  markAsRead,
  markAsDelivered,
  setHasMore,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;