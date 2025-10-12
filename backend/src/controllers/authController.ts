import { Request, Response } from 'express';
import { UserModel } from '../models';
import { LoginRequest } from '../types';
import { 
  verifyPassword, 
  generateToken, 
  createResponse, 
  isValidEmail,
  sanitizeInput 
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

    // Kullanıcıyı bul
    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    });

    if (!user) {
      res.status(401).json(createResponse(false, 'Geçersiz email veya şifre'));
      return;
    }

    // Şifreyi doğrula
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json(createResponse(false, 'Geçersiz email veya şifre'));
      return;
    }

    // JWT token oluştur
    const token = generateToken(user.id.toString());

    // Kullanıcı bilgilerini şifre olmadan döndür
    const userResponse = user.toObject();
    const { passwordHash, ...userWithoutPassword } = userResponse;

    res.status(200).json(createResponse(true, 'Giriş başarılı', {
      user: userWithoutPassword,
      token
    }));
  } catch (error) {
    console.error('Kullanıcı girişi hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Giriş sırasında hata oluştu'));
  }
};

// Token doğrulama
export const verifyTokenEndpoint = async (req: Request, res: Response): Promise<void> => {
  try {
    // Bu endpoint sadece middleware'den geçen istekler için çalışır
    // Yani token zaten doğrulanmış demektir
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json(createResponse(false, 'Geçersiz token'));
      return;
    }

    // Kullanıcı bilgilerini getir
    const user = await UserModel.findById(userId).select('-passwordHash');
    
    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    res.status(200).json(createResponse(true, 'Token geçerli', { user }));
  } catch (error) {
    console.error('Token doğrulama hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Token doğrulama sırasında hata oluştu'));
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

    // Kullanıcıyı bul
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    // Mevcut şifreyi doğrula
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      res.status(401).json(createResponse(false, 'Mevcut şifre hatalı'));
      return;
    }

    // Yeni şifreyi hashle ve güncelle
    const { hashPassword } = await import('../utils');
    const newPasswordHash = await hashPassword(newPassword);
    
    await UserModel.findByIdAndUpdate(userId, { 
      passwordHash: newPasswordHash 
    });

    res.status(200).json(createResponse(true, 'Şifre başarıyla değiştirildi'));
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Şifre değiştirme sırasında hata oluştu'));
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

    const user = await UserModel.findOne({ 
      email: email.toLowerCase() 
    });

    // Güvenlik için, kullanıcı bulunamasa bile başarılı mesajı döndür
    if (!user) {
      res.status(200).json(createResponse(true, 'Eğer bu email kayıtlıysa, şifre sıfırlama talimatları gönderilecektir'));
      return;
    }

    // TODO: Burada email gönderme servisi entegre edilebilir
    // Şimdilik sadece başarılı mesajı döndürüyoruz
    console.log(`Şifre sıfırlama talebi: ${email} (User ID: ${user.id})`);
    
    res.status(200).json(createResponse(true, 'Şifre sıfırlama talimatları email adresinize gönderildi'));
  } catch (error) {
    console.error('Şifre sıfırlama talebi hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Şifre sıfırlama talebi sırasında hata oluştu'));
  }
};