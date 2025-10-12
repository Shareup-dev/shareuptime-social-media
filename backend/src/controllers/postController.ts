import { Request, Response } from 'express';
import { PostModel, UserModel } from '../models';
import { CreatePostRequest, PaginatedResponse } from '../types';
import { 
  createResponse, 
  createPaginatedResponse,
  sanitizeInput 
} from '../utils';

// Gönderi oluştur
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, mediaUrls }: CreatePostRequest = req.body;
    const authorId = (req as any).userId; // Middleware'den gelen kullanıcı ID'si

    // Girdi doğrulaması
    if (!content || content.trim().length === 0) {
      res.status(400).json(createResponse(false, 'Gönderi içeriği gereklidir'));
      return;
    }

    if (content.length > 2200) {
      res.status(400).json(createResponse(false, 'Gönderi içeriği 2200 karakterden uzun olamaz'));
      return;
    }

    // Medya URL'lerini doğrula
    let validatedMediaUrls: string[] = [];
    if (mediaUrls && Array.isArray(mediaUrls)) {
      validatedMediaUrls = mediaUrls.filter(url => 
        typeof url === 'string' && url.trim().length > 0
      ).slice(0, 10); // Maksimum 10 medya dosyası
    }

    // Yeni gönderi oluştur
    const newPost = new PostModel({
      authorId,
      content: sanitizeInput(content),
      mediaUrls: validatedMediaUrls
    });

    const savedPost = await newPost.save();

    // Kullanıcının gönderi sayısını artır
    await UserModel.findByIdAndUpdate(authorId, {
      $inc: { postsCount: 1 }
    });

    // Gönderi ile birlikte yazar bilgilerini de döndür
    const postWithAuthor = await PostModel.findById(savedPost.id)
      .populate('authorId', 'username firstName lastName profileImage isVerified');

    res.status(201).json(createResponse(true, 'Gönderi başarıyla oluşturuldu', postWithAuthor));
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
    const skip = (pageNumber - 1) * limitNumber;

    // Gönderileri tarih sırasına göre getir (en yeni önce)
    const posts = await PostModel.find()
      .populate('authorId', 'username firstName lastName profileImage isVerified')
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip(skip);

    const total = await PostModel.countDocuments();

    res.status(200).json(createPaginatedResponse(
      posts, 
      pageNumber, 
      limitNumber, 
      total, 
      'Gönderiler başarıyla getirildi'
    ));
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

    const post = await PostModel.findById(postId)
      .populate('authorId', 'username firstName lastName profileImage isVerified');

    if (!post) {
      res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
      return;
    }

    res.status(200).json(createResponse(true, 'Gönderi getirildi', post));
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
    const skip = (pageNumber - 1) * limitNumber;

    // Kullanıcının varlığını kontrol et
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json(createResponse(false, 'Kullanıcı bulunamadı'));
      return;
    }

    const posts = await PostModel.find({ authorId: userId })
      .populate('authorId', 'username firstName lastName profileImage isVerified')
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip(skip);

    const total = await PostModel.countDocuments({ authorId: userId });

    res.status(200).json(createPaginatedResponse(
      posts, 
      pageNumber, 
      limitNumber, 
      total, 
      'Kullanıcı gönderileri getirildi'
    ));
  } catch (error) {
    console.error('Kullanıcı gönderilerini getirme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Kullanıcı gönderileri getirilirken hata oluştu'));
  }
};

// Gönderi güncelle
export const updatePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { content, mediaUrls } = req.body;
    const userId = (req as any).userId;

    if (!postId) {
      res.status(400).json(createResponse(false, 'Gönderi ID gereklidir'));
      return;
    }

    // Gönderiyi bul
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
      return;
    }

    // Sadece gönderi sahibi güncelleyebilir
    if (post.authorId.toString() !== userId) {
      res.status(403).json(createResponse(false, 'Sadece kendi gönderilerinizi güncelleyebilirsiniz'));
      return;
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {};

    if (content !== undefined) {
      if (!content || content.trim().length === 0) {
        res.status(400).json(createResponse(false, 'Gönderi içeriği boş olamaz'));
        return;
      }
      if (content.length > 2200) {
        res.status(400).json(createResponse(false, 'Gönderi içeriği 2200 karakterden uzun olamaz'));
        return;
      }
      updateData.content = sanitizeInput(content);
    }

    if (mediaUrls !== undefined) {
      let validatedMediaUrls: string[] = [];
      if (Array.isArray(mediaUrls)) {
        validatedMediaUrls = mediaUrls.filter(url => 
          typeof url === 'string' && url.trim().length > 0
        ).slice(0, 10);
      }
      updateData.mediaUrls = validatedMediaUrls;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    ).populate('authorId', 'username firstName lastName profileImage isVerified');

    res.status(200).json(createResponse(true, 'Gönderi güncellendi', updatedPost));
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

    // Gönderiyi bul
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).json(createResponse(false, 'Gönderi bulunamadı'));
      return;
    }

    // Sadece gönderi sahibi silebilir
    if (post.authorId.toString() !== userId) {
      res.status(403).json(createResponse(false, 'Sadece kendi gönderilerinizi silebilirsiniz'));
      return;
    }

    // Gönderiyi sil
    await PostModel.findByIdAndDelete(postId);

    // Kullanıcının gönderi sayısını azalt
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { postsCount: -1 }
    });

    res.status(200).json(createResponse(true, 'Gönderi silindi'));
  } catch (error) {
    console.error('Gönderi silme hatası:', error);
    res.status(500).json(createResponse(false, 'Sunucu hatası', undefined, 'Gönderi silinirken hata oluştu'));
  }
};