import { Request, Response } from 'express';
import { UserModel } from '../models';
import { CreateUserRequest, UpdateUserRequest, User } from '../types';
import { 
  hashPassword, 
  createResponse, 
  isValidEmail, 
  isValidUsername, 
  sanitizeInput 
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
      res.status(400).json(createResponse(false, 'Kullanıcı adı 3-20 karakter arası olmalı ve sadece harf, rakam ve _ içerebilir'));
      return;
    }

    if (password.length < 6) {
      res.status(400).json(createResponse(false, 'Şifre en az 6 karakter olmalıdır'));
      return;
    }

    // Mevcut kullanıcı kontrolü
    const existingUser = await UserModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      res.status(409).json(createResponse(false, 'Bu email veya kullanıcı adı zaten kullanılıyor'));
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Yeni kullanıcı oluştur
    const newUser = new UserModel({
      username: sanitizeInput(username),
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      firstName: firstName ? sanitizeInput(firstName) : undefined,
      lastName: lastName ? sanitizeInput(lastName) : undefined
    });

    const savedUser = await newUser.save();

    // Şifreyi response'dan çıkar
    const userResponse = savedUser.toObject();
    const { passwordHash, ...userWithoutPassword } = userResponse;

    res.status(201).json(createResponse(true, 'Kullanıcı başarıyla oluşturuldu', userWithoutPassword));
  } catch (error) {
    console.error('Kullanıcı kayıt hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı kaydı sırasında hata oluştu'));
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

    const user = await UserModel.findById(userId).select('-passwordHash');

    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    res.status(200).json(createResponse(true, 'Kullanıcı profili getirildi', user));
  } catch (error) {
    console.error('Kullanıcı profili getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı profili getirilirken hata oluştu'));
  }
};

// Kullanıcı profilini güncelle
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const updateData: UpdateUserRequest = req.body;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    // Güncelleme verilerini sanitize et
    const sanitizedUpdateData: Partial<User> = {};
    
    if (updateData.firstName !== undefined) {
      sanitizedUpdateData.firstName = sanitizeInput(updateData.firstName);
    }
    
    if (updateData.lastName !== undefined) {
      sanitizedUpdateData.lastName = sanitizeInput(updateData.lastName);
    }
    
    if (updateData.bio !== undefined) {
      sanitizedUpdateData.bio = sanitizeInput(updateData.bio);
      if (sanitizedUpdateData.bio.length > 160) {
        res.status(400).json(createResponse(false, 'Bio 160 karakterden uzun olamaz'));
        return;
      }
    }
    
    if (updateData.profileImage !== undefined) {
      sanitizedUpdateData.profileImage = updateData.profileImage;
    }
    
    if (updateData.isPrivate !== undefined) {
      sanitizedUpdateData.isPrivate = updateData.isPrivate;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      sanitizedUpdateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    res.status(200).json(createResponse(true, 'Kullanıcı profili güncellendi', updatedUser));
  } catch (error) {
    console.error('Kullanıcı profili güncelleme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı profili güncellenirken hata oluştu'));
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
    const skip = (pageNumber - 1) * limitNumber;

    // Kullanıcı adı veya isimde arama yap
    const searchRegex = new RegExp(sanitizeInput(query), 'i');
    
    const users = await UserModel.find({
      $or: [
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    })
    .select('-passwordHash')
    .limit(limitNumber)
    .skip(skip)
    .sort({ username: 1 });

    const total = await UserModel.countDocuments({
      $or: [
        { username: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Kullanıcılar getirildi',
      data: users,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Kullanıcı arama hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı arama sırasında hata oluştu'));
  }
};