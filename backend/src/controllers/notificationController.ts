import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { pgPool } from '../config/database';
import { createResponse, createPaginatedResponse } from '../utils';

// Kullanıcının bildirimlerini getir
export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { page = 1, limit = 20 } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      const notificationsQuery = `
        SELECT n.*, 
               u.username, u.first_name, u.last_name, u.profile_picture_url,
               p.content as post_content, p.media_urls as post_media
        FROM notifications n
        LEFT JOIN users u ON n.actor_id = u.id
        LEFT JOIN posts p ON n.post_id = p.id
        WHERE n.recipient_id = $1
        ORDER BY n.created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const notificationsResult = await client.query(notificationsQuery, [
        userId,
        limitNumber,
        offset,
      ]);

      // Get total count
      const countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE recipient_id = $1';
      const countResult = await client.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0].total);

      res
        .status(200)
        .json(
          createPaginatedResponse(
            notificationsResult.rows,
            pageNumber,
            limitNumber,
            total,
            'Bildirimler getirildi',
          ),
        );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Bildirimleri getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Bildirimler getirilirken hata oluştu'),
      );
  }
};

// Bildirimi okundu olarak işaretle
export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = (req as any).userId;

    const client = await pgPool.connect();
    try {
      // Verify notification belongs to user
      const verifyQuery = 'SELECT id FROM notifications WHERE id = $1 AND recipient_id = $2';
      const verifyResult = await client.query(verifyQuery, [notificationId, userId]);

      if (verifyResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Bildirim bulunamadı'));
        return;
      }

      // Mark as read
      const updateQuery = 'UPDATE notifications SET is_read = true WHERE id = $1';
      await client.query(updateQuery, [notificationId]);

      res.status(200).json(createResponse(true, 'Bildirim okundu olarak işaretlendi'));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Bildirim okundu işaretleme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Bildirim işaretlenirken hata oluştu'),
      );
  }
};

// Tüm bildirimleri okundu olarak işaretle
export const markAllNotificationsAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const client = await pgPool.connect();
    try {
      const updateQuery =
        'UPDATE notifications SET is_read = true WHERE recipient_id = $1 AND is_read = false';
      const result = await client.query(updateQuery, [userId]);

      res
        .status(200)
        .json(createResponse(true, `${result.rowCount} bildirim okundu olarak işaretlendi`));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Tüm bildirimleri okundu işaretleme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Bildirimler işaretlenirken hata oluştu'),
      );
  }
};

// Okunmamış bildirim sayısını getir
export const getUnreadNotificationCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const client = await pgPool.connect();
    try {
      const countQuery =
        'SELECT COUNT(*) as count FROM notifications WHERE recipient_id = $1 AND is_read = false';
      const countResult = await client.query(countQuery, [userId]);
      const count = parseInt(countResult.rows[0].count);

      res.status(200).json(createResponse(true, 'Okunmamış bildirim sayısı', { count }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Okunmamış bildirim sayısı hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Bildirim sayısı getirilirken hata oluştu',
        ),
      );
  }
};

// Bildirim oluştur (internal use)
export const createNotification = async (
  recipientId: string,
  type: string,
  actorId?: string,
  postId?: string,
  message?: string,
): Promise<void> => {
  try {
    const client = await pgPool.connect();
    try {
      const notificationId = uuidv4();
      const insertQuery = `
        INSERT INTO notifications (id, recipient_id, type, actor_id, post_id, message)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const newNotificationResult = await client.query(insertQuery, [
        notificationId,
        recipientId,
        type,
        actorId,
        postId,
        message,
      ]);

      // Send real-time notification
      const wsService = (global as any).wsService;
      if (wsService) {
        wsService.sendNotificationToUser(recipientId, newNotificationResult.rows[0]);
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Bildirim oluşturma hatası:', error);
  }
};
