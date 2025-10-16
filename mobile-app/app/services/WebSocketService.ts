import io, { Socket } from 'socket.io-client';
import { WS_BASE_URL } from '@/config/env';

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
  message: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
  timestamp: string;
}

export type Listener = (payload: unknown) => void;

export class ShareUpTimeWebSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: Map<string, Listener[]> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  connect(token: string): void {
    this.token = token;

    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(WS_BASE_URL, {
      auth: {
        token: this.token,
      },
      autoConnect: true,
    });

    this.setupSocketEventHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      // console.log('✅ Connected to ShareUpTime WebSocket');
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', () => {
      // console.log('❌ Disconnected from ShareUpTime WebSocket');
      this.emit('connection_status', { connected: false });
    });

    this.socket.on('connect_error', (error: Error) => {
      // route to centralized logger if available; keep console for dev visibility
      console.error('WebSocket connection error:', error);
      this.emit('connection_error', { error: error.message });
    });

    // Message events
    this.socket.on('new_message', (message: Message) => {
      // console.log('📨 New message received:', message);
      this.emit('new_message', message);
    });

    // Typing indicators
    this.socket.on('user_typing', (data: { userId: string; conversationId: string }) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_stopped_typing', (data: { userId: string; conversationId: string }) => {
      this.emit('user_stopped_typing', data);
    });

    // Notifications
    this.socket.on('notification', (notification: Notification) => {
      // console.log('🔔 New notification:', notification);
      this.emit('notification', notification);
    });

    // Post interactions
    this.socket.on('post_interaction', (data: unknown) => {
      // console.log('💬 Post interaction:', data);
      this.emit('post_interaction', data);
    });

    // User status
    this.socket.on('user_status_change', (data: { userId: string; status: string }) => {
      this.emit('user_status_change', data);
    });

    // Follow events
    this.socket.on('new_follower', (data: { followerId: string; timestamp: string }) => {
      this.emit('new_follower', data);
    });

    // Story interactions
    this.socket.on('story_interaction', (data: unknown) => {
      this.emit('story_interaction', data);
    });
  }

  // Event system
  on(event: string, callback: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback?: Listener): void {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: unknown): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(data));
    }
  }

  private setupEventListeners(): void {
    // Redux state changes can be listened here
    // For example, when user logs out, disconnect WebSocket
  }

  // Messaging methods
  joinConversation(conversationId: string): void {
    this.socket?.emit('join_conversation', conversationId);
  }

  leaveConversation(conversationId: string): void {
    this.socket?.emit('leave_conversation', conversationId);
  }

  sendMessage(
    conversationId: string,
    message: string,
    messageType: 'text' | 'image' | 'file' = 'text',
  ): void {
    this.socket?.emit('send_message', {
      conversationId,
      message,
      messageType,
    });
  }

  startTyping(conversationId: string): void {
    this.socket?.emit('typing_start', conversationId);
  }

  stopTyping(conversationId: string): void {
    this.socket?.emit('typing_stop', conversationId);
  }

  // Post interaction methods
  likePost(postId: string, postOwnerId: string): void {
    this.socket?.emit('post_liked', { postId, postOwnerId });
  }

  commentOnPost(postId: string, postOwnerId: string, comment: string): void {
    this.socket?.emit('post_commented', { postId, postOwnerId, comment });
  }

  // User activity methods
  followUser(followedUserId: string): void {
    this.socket?.emit('user_followed', followedUserId);
  }

  viewStory(storyId: string, storyOwnerId: string): void {
    this.socket?.emit('story_viewed', { storyId, storyOwnerId });
  }

  setUserOnline(): void {
    this.socket?.emit('user_online');
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton instance
export const webSocketClient = new ShareUpTimeWebSocketClient();

export default webSocketClient;
