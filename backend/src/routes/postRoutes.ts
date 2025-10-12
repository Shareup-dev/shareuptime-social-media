import { Router } from 'express';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  getUserPosts, 
  updatePost, 
  deletePost 
} from '../controllers/postController';
import { authenticateToken, optionalAuthentication, rateLimiter, validateRequired } from '../middleware';

const router = Router();

// POST /api/posts - Gönderi oluştur (korumalı)
router.post('/', 
  authenticateToken,
  rateLimiter(10, 60 * 60 * 1000), // Saatte max 10 gönderi
  validateRequired(['content']),
  createPost
);

// GET /api/posts - Gönderileri listele (herkese açık, opsiyonel auth)
router.get('/', 
  optionalAuthentication,
  getPosts
);

// GET /api/posts/:postId - Belirli gönderiyi getir (herkese açık)
router.get('/:postId', getPostById);

// GET /api/posts/user/:userId - Kullanıcının gönderilerini getir (herkese açık)
router.get('/user/:userId', getUserPosts);

// PUT /api/posts/:postId - Gönderi güncelle (korumalı)
router.put('/:postId', 
  authenticateToken,
  updatePost
);

// DELETE /api/posts/:postId - Gönderi sil (korumalı)
router.delete('/:postId', 
  authenticateToken,
  deletePost
);

export default router;