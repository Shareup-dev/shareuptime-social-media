import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { pgPool } from '../config/database';
import { FileManager } from '../middleware/uploadMiddleware';
import { createResponse, createPaginatedResponse } from '../utils';

// Konuşma oluştur veya getir
export const getOrCreateConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { participantIds } = req.body; // Array of user IDs
    const currentUserId = (req as any).userId;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      res.status(400).json(createResponse(false, 'Participant IDs gereklidir'));
      return;
    }

    // Include current user in participants
    const allParticipants = [...new Set([currentUserId, ...participantIds])];

    const client = await pgPool.connect();
    try {
      // Check if conversation already exists between these participants
      const existingConvQuery = `
        SELECT c.id, c.type, c.name, c.created_at,
               COUNT(DISTINCT cp.user_id) as participant_count
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE c.id IN (
          SELECT conversation_id 
          FROM conversation_participants 
          WHERE user_id = ANY($1) AND is_active = true
          GROUP BY conversation_id
          HAVING COUNT(DISTINCT user_id) = $2
        )
        GROUP BY c.id, c.type, c.name, c.created_at
        LIMIT 1
      `;

      const existingConvResult = await client.query(existingConvQuery, [
        allParticipants,
        allParticipants.length,
      ]);

      if (existingConvResult.rows.length > 0) {
        // Return existing conversation
        res.status(200).json(createResponse(true, 'Konuşma bulundu', existingConvResult.rows[0]));
        return;
      }

      // Create new conversation
      const conversationId = uuidv4();
      const conversationType = allParticipants.length > 2 ? 'group' : 'direct';

      const createConvQuery = `
        INSERT INTO conversations (id, type, creator_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const newConvResult = await client.query(createConvQuery, [
        conversationId,
        conversationType,
        currentUserId,
      ]);

      // Add participants
      const addParticipantsQuery = `
        INSERT INTO conversation_participants (id, conversation_id, user_id, role)
        VALUES ${allParticipants.map((_, index) => `($${index * 3 + 4}, $1, $${index * 3 + 5}, $${index * 3 + 6})`).join(', ')}
      `;

      const participantValues = [conversationId];
      allParticipants.forEach((participantId, index) => {
        participantValues.push(uuidv4()); // participant ID
        participantValues.push(participantId); // user ID
        participantValues.push(participantId === currentUserId ? 'admin' : 'member'); // role
      });

      await client.query(addParticipantsQuery, participantValues);

      res.status(201).json(createResponse(true, 'Yeni konuşma oluşturuldu', newConvResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Konuşma oluşturma hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Konuşma oluşturulurken hata oluştu'),
      );
  }
};

// Kullanıcının konuşmalarını listele
export const getUserConversations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 20 } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      const conversationsQuery = `
        SELECT DISTINCT c.id, c.type, c.name, c.created_at, c.updated_at,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) as message_count,
               (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message_time
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = $1 AND cp.is_active = true
        ORDER BY c.updated_at DESC
        LIMIT $2 OFFSET $3
      `;

      const conversationsResult = await client.query(conversationsQuery, [
        userId,
        limitNumber,
        offset,
      ]);

      // Get total count
      const countQuery = `
        SELECT COUNT(DISTINCT c.id) as total
        FROM conversations c
        JOIN conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = $1 AND cp.is_active = true
      `;
      const countResult = await client.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0].total);

      res
        .status(200)
        .json(
          createPaginatedResponse(
            conversationsResult.rows,
            pageNumber,
            limitNumber,
            total,
            'Konuşmalar getirildi',
          ),
        );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Konuşmaları getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Konuşmalar getirilirken hata oluştu'),
      );
  }
};

// Mesaj gönder
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { content, replyToMessageId } = req.body;
    const senderId = (req as any).userId;
    const file = req.file;

    if (!content && !file) {
      res.status(400).json(createResponse(false, 'Mesaj içeriği veya medya gereklidir'));
      return;
    }

    let mediaUrl: string | null = null;
    let messageType = 'text';

    // Dosya varsa işle
    if (file) {
      try {
        // Dosya validasyonu
        const isValid = await FileManager.validateFile(file);
        if (!isValid) {
          FileManager.deleteFile(file.path);
          res.status(400).json(createResponse(false, 'Geçersiz dosya'));
          return;
        }

        mediaUrl = FileManager.getFileUrl(file.path);
        messageType = file.mimetype.startsWith('image/')
          ? 'image'
          : file.mimetype.startsWith('video/')
            ? 'video'
            : 'file';
      } catch (mediaError) {
        console.error('Medya işleme hatası:', mediaError);
        if (file) FileManager.deleteFile(file.path);
        res.status(500).json(createResponse(false, 'Medya dosyası işlenirken hata oluştu'));
        return;
      }
    }

    const client = await pgPool.connect();
    try {
      // Verify user is participant in conversation
      const participantQuery = `
        SELECT id FROM conversation_participants 
        WHERE conversation_id = $1 AND user_id = $2 AND is_active = true
      `;
      const participantResult = await client.query(participantQuery, [conversationId, senderId]);

      if (participantResult.rows.length === 0) {
        res.status(403).json(createResponse(false, 'Bu konuşmaya mesaj gönderme yetkiniz yok'));
        return;
      }

      // Create message
      const messageId = uuidv4();
      const insertMessageQuery = `
        INSERT INTO messages (id, conversation_id, sender_id, content, media_url, message_type, reply_to_message_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const newMessageResult = await client.query(insertMessageQuery, [
        messageId,
        conversationId,
        senderId,
        content || '',
        mediaUrl,
        messageType,
        replyToMessageId,
      ]);

      // Update conversation's updated_at
      const updateConvQuery =
        'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1';
      await client.query(updateConvQuery, [conversationId]);

      // Get message with sender info
      const messageWithSenderQuery = `
        SELECT m.*, u.username, u.first_name, u.last_name, u.profile_picture_url
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.id = $1
      `;
      const messageWithSenderResult = await client.query(messageWithSenderQuery, [messageId]);

      // Send real-time notification via WebSocket
      const wsService = (global as any).wsService;
      if (wsService) {
        wsService.sendMessageToConversation(conversationId, messageWithSenderResult.rows[0]);
      }

      res
        .status(201)
        .json(createResponse(true, 'Mesaj gönderildi', messageWithSenderResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res
      .status(500)
      .json(createResponse(false, 'Sunucu hatası', undefined, 'Mesaj gönderilirken hata oluştu'));
  }
};

// Konuşma mesajlarını getir
export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = (req as any).userId;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 50, 100);
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      // Verify user is participant
      const participantQuery = `
        SELECT id FROM conversation_participants 
        WHERE conversation_id = $1 AND user_id = $2 AND is_active = true
      `;
      const participantResult = await client.query(participantQuery, [conversationId, userId]);

      if (participantResult.rows.length === 0) {
        res.status(403).json(createResponse(false, 'Bu konuşmaya erişim yetkiniz yok'));
        return;
      }

      // Get messages
      const messagesQuery = `
        SELECT m.*, u.username, u.first_name, u.last_name, u.profile_picture_url,
               rm.content as reply_content, ru.username as reply_username
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        LEFT JOIN messages rm ON m.reply_to_message_id = rm.id
        LEFT JOIN users ru ON rm.sender_id = ru.id
        WHERE m.conversation_id = $1 AND m.is_deleted = false
        ORDER BY m.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const messagesResult = await client.query(messagesQuery, [
        conversationId,
        limitNumber,
        offset,
      ]);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM messages
        WHERE conversation_id = $1 AND is_deleted = false
      `;
      const countResult = await client.query(countQuery, [conversationId]);
      const total = parseInt(countResult.rows[0].total);

      res.status(200).json(
        createPaginatedResponse(
          messagesResult.rows.reverse(), // Reverse to show oldest first
          pageNumber,
          limitNumber,
          total,
          'Mesajlar getirildi',
        ),
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    res
      .status(500)
      .json(createResponse(false, 'Sunucu hatası', undefined, 'Mesajlar getirilirken hata oluştu'));
  }
};

// Mesajı okundu olarak işaretle
export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = (req as any).userId;

    const client = await pgPool.connect();
    try {
      // Verify user can access this message
      const messageQuery = `
        SELECT m.id, m.conversation_id
        FROM messages m
        JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
        WHERE m.id = $1 AND cp.user_id = $2 AND cp.is_active = true
      `;
      const messageResult = await client.query(messageQuery, [messageId, userId]);

      if (messageResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Mesaj bulunamadı veya erişim yetkiniz yok'));
        return;
      }

      // Mark as read
      const updateQuery = 'UPDATE messages SET is_read = true WHERE id = $1';
      await client.query(updateQuery, [messageId]);

      res.status(200).json(createResponse(true, 'Mesaj okundu olarak işaretlendi'));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Mesaj okundu işaretleme hatası:', error);
    res
      .status(500)
      .json(createResponse(false, 'Sunucu hatası', undefined, 'Mesaj işaretlenirken hata oluştu'));
  }
};
