import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { pgPool } from '../config/database';
import { createResponse, createPaginatedResponse, sanitizeInput } from '../utils';

// GET /api/posts/:postId/comments - List comments for a post
export const getPostComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const offset = (pageNumber - 1) * limitNumber;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Ensure post exists
      const postCheck = await client.query(
        'SELECT id FROM posts WHERE id = $1 AND is_active = true',
        [postId],
      );
      if (postCheck.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
        return;
      }

      const commentsQuery = `
        SELECT c.*, 
               u.username, u.first_name, u.last_name, u.profile_picture_url
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1 AND c.is_active = true
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const commentsResult = await client.query(commentsQuery, [postId, limitNumber, offset]);

      const countQuery =
        'SELECT COUNT(*) AS total FROM comments WHERE post_id = $1 AND is_active = true';
      const countResult = await client.query(countQuery, [postId]);
      const total = parseInt(countResult.rows[0].total);

      res
        .status(200)
        .json(
          createPaginatedResponse(
            commentsResult.rows,
            pageNumber,
            limitNumber,
            total,
            'Yorumlar başarıyla getirildi',
          ),
        );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Yorumları getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası'));
  }
};

// POST /api/posts/:postId/comments - Create a comment for a post
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body as { content?: string; parentId?: string };
    const userId = req.userId as string;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }
    if (!content || content.trim().length === 0) {
      res.status(400).json(createResponse(false, 'Yorum içeriği gereklidir'));
      return;
    }
    if (content.length > 500) {
      res.status(400).json(createResponse(false, 'Yorum içeriği 500 karakterden uzun olamaz'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Ensure post exists
      const postCheck = await client.query(
        'SELECT id FROM posts WHERE id = $1 AND is_active = true',
        [postId],
      );
      if (postCheck.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
        return;
      }

      // Optional: Ensure parent comment exists
      if (parentId) {
        const parentCheck = await client.query(
          'SELECT id FROM comments WHERE id = $1 AND is_active = true',
          [parentId],
        );
        if (parentCheck.rows.length === 0) {
          res.status(400).json(createResponse(false, 'Geçersiz üst yorum ID'));
          return;
        }
      }

      const commentId = uuidv4();
      const insertQuery = `
        INSERT INTO comments (id, post_id, user_id, parent_comment_id, content, likes_count, is_active)
        VALUES ($1, $2, $3, $4, $5, 0, true)
        RETURNING *
      `;
      const _inserted = await client.query(insertQuery, [
        commentId,
        postId,
        userId,
        parentId || null,
        sanitizeInput(content),
      ]);

      // Update post comment count
      await client.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [
        postId,
      ]);

      // Return with author fields
      const withAuthor = await client.query(
        `SELECT c.*, u.username, u.first_name, u.last_name, u.profile_picture_url 
         FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1`,
        [commentId],
      );

      res.status(201).json(createResponse(true, 'Yorum oluşturuldu', withAuthor.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası'));
  }
};

export default { getPostComments, createComment };
