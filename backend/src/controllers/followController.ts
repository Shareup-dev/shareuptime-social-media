import { Request, Response } from 'express';

import { FollowModel, UserModel } from '../models';
import { createResponse, createPaginatedResponse } from '../utils';

// Kullanıcıyı takip et
export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // Takip edilecek kullanıcı
    const followerId = (req as any).userId; // Takip eden kullanıcı (middleware'den)

    if (!userId) {
      res.status(400).json(createResponse(false, 'Takip edilecek kullanıcı ID gereklidir'));
      return;
    }

    // Kendini takip etmeyi engelle
    if (userId === followerId) {
      res.status(400).json(createResponse(false, 'Kendinizi takip edemezsiniz'));
      return;
    }

    // Takip edilecek kullanıcının varlığını kontrol et
    const userToFollow = await UserModel.findById(userId);
    if (!userToFollow) {
      res.status(404).json(createResponse(false, 'Takip edilecek kullanıcı bulunamadı'));
      return;
    }

    // Zaten takip edip etmediğini kontrol et
    const existingFollow = await FollowModel.findOne({
      followerId,
      followingId: userId,
    });

    if (existingFollow) {
      res.status(409).json(createResponse(false, 'Bu kullanıcıyı zaten takip ediyorsunuz'));
      return;
    }

    // Yeni takip ilişkisi oluştur
    const newFollow = new FollowModel({
      followerId,
      followingId: userId,
    });

    await newFollow.save();

    // Kullanıcı sayaçlarını güncelle
    await Promise.all([
      UserModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } }),
      UserModel.findByIdAndUpdate(userId, { $inc: { followersCount: 1 } }),
    ]);

    res.status(201).json(createResponse(true, 'Kullanıcı takip edildi'));
  } catch (error) {
    console.error('Kullanıcı takip etme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Takip işlemi sırasında hata oluştu'),
      );
  }
};

// Kullanıcıyı takipten çık
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // Takipten çıkılacak kullanıcı
    const followerId = (req as any).userId; // Takip eden kullanıcı

    if (!userId) {
      res.status(400).json(createResponse(false, 'Takipten çıkılacak kullanıcı ID gereklidir'));
      return;
    }

    // Takip ilişkisini bul
    const followRelation = await FollowModel.findOne({
      followerId,
      followingId: userId,
    });

    if (!followRelation) {
      res.status(404).json(createResponse(false, 'Bu kullanıcıyı takip etmiyorsunuz'));
      return;
    }

    // Takip ilişkisini sil
    await FollowModel.findByIdAndDelete(followRelation.id);

    // Kullanıcı sayaçlarını güncelle
    await Promise.all([
      UserModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } }),
      UserModel.findByIdAndUpdate(userId, { $inc: { followersCount: -1 } }),
    ]);

    res.status(200).json(createResponse(true, 'Kullanıcı takipten çıkarıldı'));
  } catch (error) {
    console.error('Takipten çıkma hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Takipten çıkma işlemi sırasında hata oluştu',
        ),
      );
  }
};

// Kullanıcının takipçilerini listele
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNumber - 1) * limitNumber;

    // Kullanıcının varlığını kontrol et
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    // Takipçileri getir
    const followers = await FollowModel.find({ followingId: userId })
      .populate('followerId', 'username firstName lastName profileImage isVerified')
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip(skip);

    const total = await FollowModel.countDocuments({ followingId: userId });

    // Sadece takipçi bilgilerini döndür
    const followerUsers = followers.map((follow) => follow.followerId);

    res
      .status(200)
      .json(
        createPaginatedResponse(
          followerUsers,
          pageNumber,
          limitNumber,
          total,
          'Takipçiler getirildi',
        ),
      );
  } catch (error) {
    console.error('Takipçileri getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(false, 'Sunucu hatası', undefined, 'Takipçiler getirilirken hata oluştu'),
      );
  }
};

// Kullanıcının takip ettiklerini listele
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNumber - 1) * limitNumber;

    // Kullanıcının varlığını kontrol et
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    // Takip ettiklerini getir
    const following = await FollowModel.find({ followerId: userId })
      .populate('followingId', 'username firstName lastName profileImage isVerified')
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip(skip);

    const total = await FollowModel.countDocuments({ followerId: userId });

    // Sadece takip edilen kullanıcı bilgilerini döndür
    const followingUsers = following.map((follow) => follow.followingId);

    res
      .status(200)
      .json(
        createPaginatedResponse(
          followingUsers,
          pageNumber,
          limitNumber,
          total,
          'Takip edilenler getirildi',
        ),
      );
  } catch (error) {
    console.error('Takip edilenleri getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Takip edilenler getirilirken hata oluştu',
        ),
      );
  }
};

// Takip durumunu kontrol et
export const checkFollowStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params; // Kontrol edilecek kullanıcı
    const followerId = (req as any).userId; // Giriş yapmış kullanıcı

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    if (!followerId) {
      res.status(401).json(createResponse(false, 'Giriş yapmanız gerekiyor'));
      return;
    }

    // Takip durumunu kontrol et
    const followRelation = await FollowModel.findOne({
      followerId,
      followingId: userId,
    });

    const isFollowing = !!followRelation;

    res.status(200).json(
      createResponse(true, 'Takip durumu getirildi', {
        isFollowing,
        userId,
        followerId,
      }),
    );
  } catch (error) {
    console.error('Takip durumu kontrol hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Takip durumu kontrol edilirken hata oluştu',
        ),
      );
  }
};

// Karşılıklı takip listesi (mutual followers)
export const getMutualFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).userId;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      res.status(400).json(createResponse(false, 'Kullanıcı ID gereklidir'));
      return;
    }

    if (!currentUserId) {
      res.status(401).json(createResponse(false, 'Giriş yapmanız gerekiyor'));
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = Math.min(parseInt(limit as string) || 20, 50);
    const skip = (pageNumber - 1) * limitNumber;

    // Her iki kullanıcının da takip ettiği kişileri bul
    const currentUserFollowing = await FollowModel.find({ followerId: currentUserId }).select(
      'followingId',
    );
    const targetUserFollowing = await FollowModel.find({ followerId: userId }).select(
      'followingId',
    );

    const currentUserFollowingIds = currentUserFollowing.map((f) => f.followingId.toString());
    const targetUserFollowingIds = targetUserFollowing.map((f) => f.followingId.toString());

    // Ortak takip edilenleri bul
    const mutualFollowingIds = currentUserFollowingIds.filter((id) =>
      targetUserFollowingIds.includes(id),
    );

    const total = mutualFollowingIds.length;
    const paginatedIds = mutualFollowingIds.slice(skip, skip + limitNumber);

    // Kullanıcı bilgilerini getir
    const mutualUsers = await UserModel.find({
      _id: { $in: paginatedIds },
    }).select('username firstName lastName profileImage isVerified');

    res
      .status(200)
      .json(
        createPaginatedResponse(
          mutualUsers,
          pageNumber,
          limitNumber,
          total,
          'Ortak takip edilenler getirildi',
        ),
      );
  } catch (error) {
    console.error('Ortak takip edilenleri getirme hatası:', error);
    res
      .status(500)
      .json(
        createResponse(
          false,
          'Sunucu hatası',
          undefined,
          'Ortak takip edilenler getirilirken hata oluştu',
        ),
      );
  }
};
