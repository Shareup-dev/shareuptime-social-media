import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { pgPool } from '../config/database';
import { ImageProcessor, FileManager } from '../middleware/uploadMiddleware';
import { CreateUserRequest, UpdateUserRequest, User } from '../types';
import {
  hashPassword,
  createResponse,
  isValidEmail,
  isValidUsername,
  sanitizeInput,
} from '../utils';

// Kullanıcı kayıt
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName }: CreateUserRequest = req.body;

    // Girdi doğrulaması
    if (!username || !email || !password) {
      res.status(400).json(createResponse(false, 'Kullanıcı adı, email ve şifre gereklidir'));
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json(createResponse(false, 'Geçersiz email formatı'));
      return;
    }

    if (!isValidUsername(username)) {
      res
        .status(400)
        .json(
          createResponse(
            false,
            'Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam ve _ içerebilir',
          ),
        );
      return;
    }

    if (password.length < 6) {
      res.status(400).json(createResponse(false, 'Şifre en az 6 karakter olmalıdır'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Mevcut kullanıcı kontrolü
      const existingUserQuery = 'SELECT id FROM users WHERE email = $1 OR username = $2';
      const existingUserResult = await client.query(existingUserQuery, [
        email.toLowerCase(),
        username.toLowerCase(),
      ]);

      if (existingUserResult.rows.length > 0) {
        res
          .status(409)
          .json(createResponse(false, 'Bu email veya kullanıcı adı zaten kullanılıyor'));
        return;
      }

      // Şifreyi hashle
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Yeni kullanıcı oluştur
      const userId = uuidv4();
      const insertUserQuery = `
        INSERT INTO users (id, username, email, password_hash, first_name, last_name) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, username, email, first_name, last_name, created_at
      `;

      const newUserResult = await client.query(insertUserQuery, [
        userId,
        sanitizeInput(username),
        email.toLowerCase(),
        hashedPassword,
        firstName ? sanitizeInput(firstName) : null,
        lastName ? sanitizeInput(lastName) : null,
      ]);

      const newUser = newUserResult.rows[0];

      res.status(201).json(createResponse(true, 'Kullanıcı başarıyla oluşturuldu', newUser));
    } catch (error) {
      console.error(
        'Kullanıcı kayıt hatası: Veritabanı bağlantısı sırasında bir hata oluştu:',
        error,
      );
      res
        .status(500)
        .json(
          createResponse(
            false,
            'Sunucu hatası',
            undefined,
            'Kullanıcı kaydı sırasında hata oluştu',
          ),
        );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı kayıt hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı kaydı sırasında hata oluştu'),
      );
  }
};

// Kullanıcı profilini görüntüle
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    // UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      res.status(400).json(createResponse(false, 'Geçersiz kullanıcı ID formatı'));
      return;
    }

    const client = await pgPool.connect();
    try {
      const userQuery = `
        SELECT id, username, email, first_name, last_name, bio, 
               profile_picture_url, cover_photo_url, is_verified, 
               is_private, location, website, created_at
        FROM users WHERE id = $1
      `;
      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
        return;
      }

      res.status(200).json(createResponse(true, 'Kullanıcı profili getirildi', userResult.rows[0]));
    } catch (error) {
      console.error(
        'Kullanıcı profili getirme hatası: Veritabanı sorgusu sırasında bir hata oluştu:',
        error,
      );
      res
        .status(500)
        .json(
          createResponse(
            false,
            'Sunucu hatası',
            undefined,
            'Kullanıcı profili getirilirken hata oluştu',
          ),
        );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Kullanıcı profili getirilirken hata oluştu',
        ),
      );
  }
};

// Kullanıcı profilini güncelle
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const updateData: UpdateUserRequest = req.body;
    const authenticatedUserId = (req as any).userId;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    // Kullanıcı sadece kendi profilini güncelleyebilir
    if (userId !== authenticatedUserId) {
      res.status(403).json(createResponse(false, 'Sadece kendi profilinizi güncelleyebilirsiniz'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Güncelleme alanlarını hazırla
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramIndex = 1;

      if (updateData.firstName !== undefined) {
        updateFields.push(`first_name = $${paramIndex++}`);
        updateValues.push(sanitizeInput(updateData.firstName));
      }

      if (updateData.lastName !== undefined) {
        updateFields.push(`last_name = $${paramIndex++}`);
        updateValues.push(sanitizeInput(updateData.lastName));
      }

      if (updateData.bio !== undefined) {
        const sanitizedBio = sanitizeInput(updateData.bio);
        if (sanitizedBio.length > 160) {
          res.status(400).json(createResponse(false, 'Bio 160 karakterden uzun olamaz'));
          return;
        }
        updateFields.push(`bio = $${paramIndex++}`);
        updateValues.push(sanitizedBio);
      }

      if (updateData.profileImage !== undefined) {
        updateFields.push(`profile_picture_url = $${paramIndex++}`);
        updateValues.push(updateData.profileImage);
      }

      if (updateData.isPrivate !== undefined) {
        updateFields.push(`is_private = $${paramIndex++}`);
        updateValues.push(updateData.isPrivate);
      }

      if (updateFields.length === 0) {
        res.status(400).json(createResponse(false, 'Güncellenecek alan bulunamadı'));
        return;
      }

      // Updated_at alanını ekle
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(userId);

      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, username, email, first_name, last_name, bio, 
                  profile_picture_url, is_private, updated_at
      `;

      const updatedUserResult = await client.query(updateQuery, updateValues);

      if (updatedUserResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
        return;
      }

      res
        .status(200)
        .json(createResponse(true, 'Kullanıcı profili güncellendi', updatedUserResult.rows[0]));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Kullanıcı profili güncellenirken hata oluştu',
        ),
      );
  }
};

// Kullanıcı ara
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, page = 1, limit = 20 } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json(createResponse(false, 'Arama sorgusu gereklidir'));
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 20;
    const offset = (pageNumber - 1) * limitNumber;

    const client = await pgPool.connect();
    try {
      const searchTerm = `%${sanitizeInput(query)}%`;

      // Kullanıcı arama sorgusu
      const searchQuery = `
        SELECT id, username, email, first_name, last_name, 
               profile_picture_url, is_verified
        FROM users 
        WHERE username ILIKE $1 
           OR first_name ILIKE $1 
           OR last_name ILIKE $1
        ORDER BY username
        LIMIT $2 OFFSET $3
      `;

      const searchResult = await client.query(searchQuery, [searchTerm, limitNumber, offset]);

      // Toplam sayıyı al
      const countQuery = `
        SELECT COUNT(*) as total
        FROM users 
        WHERE username ILIKE $1 
           OR first_name ILIKE $1 
           OR last_name ILIKE $1
      `;
      const countResult = await client.query(countQuery, [searchTerm]);
      const total = parseInt(countResult.rows[0].total);

      res.status(200).json({
        success: true,
        message: 'Kullanıcılar getirildi',
        data: searchResult.rows,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı arama hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı arama sırasında hata oluştu'),
      );
  }
};

// Profil resmi yükleme
export const uploadProfilePicture = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const file = req.file;

    if (!file) {
      res.status(400).json(createResponse(false, 'Profil resmi gereklidir'));
      return;
    }

    // Dosya validasyonu
    const isValid = await FileManager.validateFile(file);
    if (!isValid) {
      FileManager.deleteFile(file.path);
      res.status(400).json(createResponse(false, 'Geçersiz dosya'));
      return;
    }

    let profilePictureUrl: string;

    try {
      // Resmi işle
      const processedPath = await ImageProcessor.processProfilePicture(file.path);
      profilePictureUrl = FileManager.getFileUrl(processedPath);

      const client = await pgPool.connect();
      try {
        // Eski profil resmini al
        const oldImageQuery = 'SELECT profile_picture_url FROM users WHERE id = $1';
        const oldImageResult = await client.query(oldImageQuery, [userId]);

        // Kullanıcının profil resmini güncelle
        const updateQuery =
          'UPDATE users SET profile_picture_url = $1 WHERE id = $2 RETURNING profile_picture_url';
        const updateResult = await client.query(updateQuery, [profilePictureUrl, userId]);

        // Eski resmi sil (varsayılan resim değilse)
        const oldImageUrl = oldImageResult.rows[0]?.profile_picture_url;
        if (oldImageUrl && !oldImageUrl.includes('default-avatar')) {
          const oldImagePath = oldImageUrl.replace('/uploads/', 'uploads/');
          FileManager.deleteFile(oldImagePath);
        }

        res.status(200).json(
          createResponse(true, 'Profil resmi başarıyla güncellendi', {
            profile_picture_url: updateResult.rows[0].profile_picture_url,
          }),
        );
      } finally {
        client.release();
      }
    } catch (processError) {
      console.error('Resim işleme hatası:', processError);
      FileManager.deleteFile(file.path);
      res.status(500).json(createResponse(false, 'Resim işlenirken hata oluştu'));
    }
  } catch (error) {
    console.error('Profil resmi yükleme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Profil resmi yüklenirken hata oluştu'),
      );
  }
};

// Kapak fotoğrafı yükleme
export const uploadCoverPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const file = req.file;

    if (!file) {
      res.status(400).json(createResponse(false, 'Kapak fotoğrafı gereklidir'));
      return;
    }

    // Dosya validasyonu
    const isValid = await FileManager.validateFile(file);
    if (!isValid) {
      FileManager.deleteFile(file.path);
      res.status(400).json(createResponse(false, 'Geçersiz dosya'));
      return;
    }

    let coverPhotoUrl: string;

    try {
      // Resmi işle (kapak fotoğrafı için farklı boyutlar)
      const processedPath = await ImageProcessor.processPostImage(file.path);
      coverPhotoUrl = FileManager.getFileUrl(processedPath);

      const client = await pgPool.connect();
      try {
        // Eski kapak fotoğrafını al
        const oldImageQuery = 'SELECT cover_photo_url FROM users WHERE id = $1';
        const oldImageResult = await client.query(oldImageQuery, [userId]);

        // Kullanıcının kapak fotoğrafını güncelle
        const updateQuery =
          'UPDATE users SET cover_photo_url = $1 WHERE id = $2 RETURNING cover_photo_url';
        const updateResult = await client.query(updateQuery, [coverPhotoUrl, userId]);

        // Eski kapak fotoğrafını sil
        const oldImageUrl = oldImageResult.rows[0]?.cover_photo_url;
        if (oldImageUrl && !oldImageUrl.includes('default-cover')) {
          const oldImagePath = oldImageUrl.replace('/uploads/', 'uploads/');
          FileManager.deleteFile(oldImagePath);
        }

        res.status(200).json(
          createResponse(true, 'Kapak fotoğrafı başarıyla güncellendi', {
            cover_photo_url: updateResult.rows[0].cover_photo_url,
          }),
        );
      } finally {
        client.release();
      }
    } catch (processError) {
      console.error('Kapak fotoğrafı işleme hatası:', processError);
      FileManager.deleteFile(file.path);
      res.status(500).json(createResponse(false, 'Kapak fotoğrafı işlenirken hata oluştu'));
    }
  } catch (error) {
    console.error('Kapak fotoğrafı yükleme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Kapak fotoğrafı yüklenirken hata oluştu',
        ),
      );
  }
};
