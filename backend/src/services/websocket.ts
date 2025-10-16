import { Server as HttpServer } from 'http';

import jwt from 'jsonwebtoken';
import { Server as SocketIOServer, Socket } from 'socket.io';

// Extend Socket interface to include userId
interface AuthenticatedSocket extends Socket {
  userId: string;
}

export class ShareUpTimeWebSocket {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shareuptime-secret') as any;
        (socket as AuthenticatedSocket).userId = decoded.userId;
        next();
      } catch (_err) {
        next(new Error('Authentication error'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;
      console.log(`User ${authSocket.userId} connected: ${socket.id}`);

      // Store user connection
      this.connectedUsers.set(authSocket.userId, socket.id);

      // Join user to their personal room
      socket.join(`user_${authSocket.userId}`);

      // Handle real-time events
      this.handleMessaging(authSocket);
      this.handleNotifications(authSocket);
      this.handlePostUpdates(authSocket);
      this.handleUserActivity(authSocket);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${authSocket.userId} disconnected: ${socket.id}`);
        this.connectedUsers.delete(authSocket.userId);
      });
    });
  }

  private handleMessaging(socket: AuthenticatedSocket) {
    // Join conversation rooms
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    });

    // Leave conversation rooms
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${socket.userId} left conversation ${conversationId}`);
    });

    // Send message
    socket.on(
      'send_message',
      (data: {
        conversationId: string;
        message: string;
        messageType: 'text' | 'image' | 'file';
      }) => {
        // Emit to all users in the conversation
        this.io.to(`conversation_${data.conversationId}`).emit('new_message', {
          senderId: socket.userId,
          conversationId: data.conversationId,
          message: data.message,
          messageType: data.messageType,
          timestamp: new Date().toISOString(),
        });
      },
    );

    // Typing indicators
    socket.on('typing_start', (conversationId: string) => {
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId,
      });
    });

    socket.on('typing_stop', (conversationId: string) => {
      socket.to(`conversation_${conversationId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        conversationId,
      });
    });
  }

  private handleNotifications(socket: AuthenticatedSocket) {
    // User activity notifications
    socket.on('user_online', () => {
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        status: 'online',
        timestamp: new Date().toISOString(),
      });
    });
  }

  private handlePostUpdates(socket: AuthenticatedSocket) {
    // Like notifications
    socket.on('post_liked', (data: { postId: string; postOwnerId: string }) => {
      this.io.to(`user_${data.postOwnerId}`).emit('post_interaction', {
        type: 'like',
        postId: data.postId,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Comment notifications
    socket.on(
      'post_commented',
      (data: { postId: string; postOwnerId: string; comment: string }) => {
        this.io.to(`user_${data.postOwnerId}`).emit('post_interaction', {
          type: 'comment',
          postId: data.postId,
          userId: socket.userId,
          comment: data.comment,
          timestamp: new Date().toISOString(),
        });
      },
    );
  }

  private handleUserActivity(socket: AuthenticatedSocket) {
    // Follow notifications
    socket.on('user_followed', (followedUserId: string) => {
      this.io.to(`user_${followedUserId}`).emit('new_follower', {
        followerId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Story views
    socket.on('story_viewed', (data: { storyId: string; storyOwnerId: string }) => {
      this.io.to(`user_${data.storyOwnerId}`).emit('story_interaction', {
        type: 'view',
        storyId: data.storyId,
        viewerId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Public methods for sending notifications from API
  public sendNotificationToUser(userId: string, notification: any) {
    this.io.to(`user_${userId}`).emit('notification', notification);
  }

  public sendMessageToConversation(conversationId: string, message: any) {
    this.io.to(`conversation_${conversationId}`).emit('new_message', message);
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default ShareUpTimeWebSocket;
