import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import { pgPool } from '../config/database';
import { LoginRequest } from '../types';
import {
  verifyPassword,
  hashPassword,
  generateToken,
  createResponse,
  isValidEmail,
  sanitizeInput,
} from '../utils';

// Kullanıcı girişi
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Girdi doğrulaması
    if (!email || !password) {
      res.status(400).json(createResponse(false, 'Email ve şifre gereklidir'));
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json(createResponse(false, 'Geçersiz email formatı'));
      return;
    }

    // PostgreSQL'den kullanıcıyı bul
    const client = await pgPool.connect();
    try {
      const userQuery =
        'SELECT id, email, username, password_hash, first_name, last_name, profile_picture_url, is_verified FROM users WHERE email = $1';
      const userResult = await client.query(userQuery, [email.toLowerCase()]);

      if (userResult.rows.length === 0) {
        res.status(401).json(createResponse(false, 'Geçersiz email veya şifre'));
        return;
      }

      const user = userResult.rows[0];

      // Şifreyi doğrula
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        res.status(401).json(createResponse(false, 'Geçersiz email veya şifre'));
        return;
      }

      // JWT token oluştur
      const token = generateToken(user.id);

      // Kullanıcı bilgilerini şifre olmadan döndür
      const { password_hash, ...userWithoutPassword } = user;

      res.status(200).json(
        createResponse(true, 'Giriş başarılı', {
          user: userWithoutPassword,
          token,
        }),
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Kullanıcı girişi hatası:', error);
    res
      .status(500)
      .json(createResponse(false, 'Sunucu hatası', undefined, 'Giriş sırasında hata oluştu'));
  }
};

// Token doğrulama
export const verifyTokenEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json(createResponse(false, 'Geçersiz token'));
      return;
    }

    // PostgreSQL'den kullanıcı bilgilerini getir
    const client = await pgPool.connect();
    try {
      const userQuery =
        'SELECT id, email, username, first_name, last_name, bio, profile_picture_url, is_verified, created_at FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
        return;
      }

      res.status(200).json(createResponse(true, 'Token geçerli', { user: userResult.rows[0] }));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Token doğrulama sırasında hata oluştu'),
      );
  }
};

// Şifre değiştirme
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).userId;

    // Girdi doğrulaması
    if (!currentPassword || !newPassword) {
      res.status(400).json(createResponse(false, 'Mevcut şifre ve yeni şifre gereklidir'));
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json(createResponse(false, 'Yeni şifre en az 6 karakter olmalıdır'));
      return;
    }

    const client = await pgPool.connect();
    try {
      // Kullanıcıyı bul
      const userQuery = 'SELECT id, password_hash FROM users WHERE id = $1';
      const userResult = await client.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
        return;
      }

      const user = userResult.rows[0];

      // Mevcut şifreyi doğrula
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        res.status(401).json(createResponse(false, 'Mevcut şifre hatalı'));
        return;
      }

      // Yeni şifreyi hashle
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Şifreyi güncelle
      const updateQuery =
        'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
      await client.query(updateQuery, [newPasswordHash, userId]);

      res.status(200).json(createResponse(true, 'Şifre başarıyla değiştirildi'));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Şifre değiştirme sırasında hata oluştu'),
      );
  }
};

// Şifre sıfırlama talebi (email ile)
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      res.status(400).json(createResponse(false, 'Geçerli bir email adresi gereklidir'));
      return;
    }

    const client = await pgPool.connect();
    try {
      const userQuery = 'SELECT id, email FROM users WHERE email = $1';
      const userResult = await client.query(userQuery, [email.toLowerCase()]);

      // Güvenlik için, kullanıcı bulunamasa bile başarılı mesajı döndür
      if (userResult.rows.length === 0) {
        res
          .status(200)
          .json(
            createResponse(
              true,
              'Eğer bu email kayıtlıysa, şifre sıfırlama talimatları gönderilecektir',
            ),
          );
        return;
      }

      const user = userResult.rows[0];

      // TODO: Burada email gönderme servisi entegre edilebilir
      // Şimdilik sadece başarılı mesajı döndürüyoruz
      console.log(`Şifre sıfırlama talebi: ${email} (User ID: ${user.id})`);

      res
        .status(200)
        .json(createResponse(true, 'Şifre sıfırlama talimatları email adresinize gönderildi'));
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Şifre sıfırlama talebi hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Şifre sıfırlama talebi sırasında hata oluştu',
        ),
      );
  }
};
