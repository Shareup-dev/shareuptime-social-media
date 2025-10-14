import { Request, Response } from 'express';
import { pgPool } from '../config/database';
import { CreatePostRequest, PaginatedResponse } from '../types';
import { 
  createResponse, 
  createPaginatedResponse,
  sanitizeInput 
} from '../utils';
import { v4 as uuidv4 } from 'uuid';
import { ImageProcessor, FileManager } from '../middleware/uploadMiddleware';

// Gönderi oluştur
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, feeling, location, privacy }: CreatePostRequest = req.body;
    const authorId = (req as any).userId;
    const files = req.files as Express.Multer.File[];

    // Girdi doğrulaması
    if (!content || content.trim().length === 0) {
      if (!files || files.length === 0) {
        res.status(400).json(createResponse(false, 'Gönderi içeriği veya medya gereklidir'));
        return;
      }
    }

    if (content && content.length > 2200) {
      res.status(400).json(createResponse(false, 'Gönderi içeriği 2200 karakterden uzun olamaz'));
      return;
    }

    // Medya dosyalarını işle
    let processedMediaUrls: string[] = [];
    let mediaTypes: string[] = [];

    if (files && files.length > 0) {
      try {
        for (const file of files) {
          // Dosya validasyonu
          const isValid = await FileManager.validateFile(file);
          if (!isValid) {
            FileManager.deleteFile(file.path);
            continue;
          }

          let processedPath: string;
          let mediaType: string;

          if (file.mimetype.startsWith('image/')) {
            // Resmi işle
            processedPath = await ImageProcessor.processPostImage(file.path);
            mediaType = 'image';
          } else if (file.mimetype.startsWith('video/')) {
            // Video için şimdilik orijinal dosyayı kullan
            processedPath = file.path;
            mediaType = 'video';
          } else {
            FileManager.deleteFile(file.path);
            continue;
          }

          const mediaUrl = FileManager.getFileUrl(processedPath);
          processedMediaUrls.push(mediaUrl);
          mediaTypes.push(mediaType);
        }
      } catch (mediaError) {
        console.error('Medya işleme hatası:', mediaError);
        // Tüm yüklenen dosyaları temizle
        if (files) {
          files.forEach(file => FileManager.deleteFile(file.path));
        }
        res.status(500).json(createResponse(false, 'Medya dosyaları işlenirken hata oluştu'));
        return;
      }
    }

    const client = await pgPool.connect();
    try {
      // Yeni gönderi oluştur
      const postId = uuidv4();
      const insertPostQuery = `
        INSERT INTO posts (id, user_id, content, media_urls, media_types, privacy_level, location, feeling) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
      
      const newPostResult = await client.query(insertPostQuery, [
        postId,
        authorId,
        content ? sanitizeInput(content) : '',
        processedMediaUrls,
        mediaTypes,
        privacy || 'public',
        location || null,
        feeling || null
      ]);

      // Gönderi ile birlikte yazar bilgilerini de getir
      const postWithAuthorQuery = `
        SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
      `;
      
      const postWithAuthorResult = await client.query(postWithAuthorQuery, [postId]);

      res.status(201).json(createResponse(true, 'Gönderi başarıyla oluşturuldu', postWithAuthorResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Gönderi oluşturma hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderi oluşturulurken hata oluştu'));
  }
};

// Gönderileri listele (ana akış)
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = (req as any).userId; // Opsiyonel, giriş yapmış kullanıcı

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50); // Maksimum 50
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      // Gönderileri tarih sırasına göre getir (en yeni önce)
      const postsQuery = `
        SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const postsResult = await client.query(postsQuery, [limitNumber, offset]);

      // Toplam sayıyı al
      const countQuery = 'SELECT COUNT(*) as total FROM posts WHERE is_active = true';
      const countResult = await client.query(countQuery);
      const total = parseInt(countResult.rows[0].total);

      res.status(200).json(createPaginatedResponse(
        postsResult.rows, 
        pageNumber, 
        limitNumber, 
        total, 
        'Gönderiler başarıyla getirildi'
      ));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Gönderileri getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderiler getirilirken hata oluştu'));
  }
};

// Belirli bir gönderiyi getir
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }

    const client = await pgPool.connect();
    try {
      const postQuery = `
        SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1 AND p.is_active = true
      `;
      
      const postResult = await client.query(postQuery, [postId]);

      if (postResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
        return;
      }

      res.status(200).json(createResponse(true, 'Gönderi getirildi', postResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Gönderi getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderi getirilirken hata oluştu'));
  }
};

// Kullanıcının gönderilerini getir
export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      // Kullanıcının varlığını kontrol et
      const userCheckQuery = 'SELECT id FROM users WHERE id = $1';
      const userCheckResult = await client.query(userCheckQuery, [userId]);
      
      if (userCheckResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
        return;
      }

      const postsQuery = `
        SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = $1 AND p.is_active = true
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const postsResult = await client.query(postsQuery, [userId, limitNumber, offset]);

      // Toplam sayıyı al
      const countQuery = 'SELECT COUNT(*) as total FROM posts WHERE user_id = $1 AND is_active = true';
      const countResult = await client.query(countQuery, [userId]);
      const total = parseInt(countResult.rows[0].total);

      res.status(200).json(createPaginatedResponse(
        postsResult.rows, 
        pageNumber, 
        limitNumber, 
        total, 
        'Kullanıcı gönderileri getirildi'
      ));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı gönderilerini getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı gönderileri getirilirken hata oluştu'));
  }
};

// Gönderi güncelle
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, mediaUrls, feeling, location, privacy } = req.body;
    const userId = (req as any).userId;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Gönderiyi bul ve yetki kontrol et
      const postCheckQuery = 'SELECT id, user_id FROM posts WHERE id = $1 AND is_active = true';
      const postCheckResult = await client.query(postCheckQuery, [postId]);
      
      if (postCheckResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
        return;
      }

      // Sadece gönderi sahibi güncelleyebilir
      if (postCheckResult.rows[0].user_id !== userId) {
        res.status(403).json(createResponse(false, 'Sadece kendi gönderilerinizi güncelleyebilirsiniz'));
        return;
      }

      // Güncelleme alanlarını hazırla
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (content !== undefined) {
        if (!content || content.trim().length === 0) {
          res.status(400).json(createResponse(false, 'Gönderi içeriği boş olamaz'));
          return;
        }
        if (content.length > 2200) {
          res.status(400).json(createResponse(false, 'Gönderi içeriği 2200 karakterden uzun olamaz'));
          return;
        }
        updateFields.push(`content = $${paramIndex++}`);
        updateValues.push(sanitizeInput(content));
      }

      if (mediaUrls !== undefined) {
        let validatedMediaUrls: string[] = [];
        let validatedMediaTypes: string[] = [];
        
        if (Array.isArray(mediaUrls)) {
          validatedMediaUrls = mediaUrls.filter(url => 
            typeof url === 'string' && url.trim().length > 0
          ).slice(0, 10);
          validatedMediaTypes = validatedMediaUrls.map(() => 'image');
        }
        
        updateFields.push(`media_urls = $${paramIndex++}`);
        updateValues.push(validatedMediaUrls);
        updateFields.push(`media_types = $${paramIndex++}`);
        updateValues.push(validatedMediaTypes);
      }

      if (feeling !== undefined) {
        updateFields.push(`feeling = $${paramIndex++}`);
        updateValues.push(feeling);
      }

      if (location !== undefined) {
        updateFields.push(`location = $${paramIndex++}`);
        updateValues.push(location);
      }

      if (privacy !== undefined) {
        updateFields.push(`privacy_level = $${paramIndex++}`);
        updateValues.push(privacy);
      }

      if (updateFields.length === 0) {
        res.status(400).json(createResponse(false, 'Güncellenecek alan bulunamadı'));
        return;
      }

      // Updated_at alanını ekle
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(postId);

      const updateQuery = `
        UPDATE posts 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const updatedPostResult = await client.query(updateQuery, updateValues);

      // Güncellenen gönderiyi yazar bilgileriyle birlikte getir
      const postWithAuthorQuery = `
        SELECT p.*, u.username, u.first_name, u.last_name, u.profile_picture_url, u.is_verified
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = $1
      `;
      
      const postWithAuthorResult = await client.query(postWithAuthorQuery, [postId]);

      res.status(200).json(createResponse(true, 'Gönderi güncellendi', postWithAuthorResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Gönderi güncelleme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderi güncellenirken hata oluştu'));
  }
};

// Gönderi sil
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const userId = (req as any).userId;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Gönderiyi bul ve yetki kontrol et
      const postCheckQuery = 'SELECT id, user_id FROM posts WHERE id = $1 AND is_active = true';
      const postCheckResult = await client.query(postCheckQuery, [postId]);
      
      if (postCheckResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
        return;
      }

      // Sadece gönderi sahibi silebilir
      if (postCheckResult.rows[0].user_id !== userId) {
        res.status(403).json(createResponse(false, 'Sadece kendi gönderilerinizi silebilirsiniz'));
        return;
      }

      // Gönderiyi soft delete (is_active = false)
      const deleteQuery = 'UPDATE posts SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
      await client.query(deleteQuery, [postId]);

      res.status(200).json(createResponse(true, 'Gönderi silindi'));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Gönderi silme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderi silinirken hata oluştu'));
  }
};