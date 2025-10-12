import { Router } from 'express';
import { 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  searchUsers 
} from '../controllers/userController';
import { authenticateToken, rateLimiter, validateRequired } from '../middleware';

const router = Router();

// POST /api/users/register - Kullanıcı kayıt (herkese açık)
router.post('/register', 
  rateLimiter(3, 60 * 60 * 1000), // Saatte max 3 kayıt
  validateRequired(['username', 'email', 'password']),
  registerUser
);

// GET /api/users/search - Kullanıcı arama (herkese açık)
router.get('/search', searchUsers);

// GET /api/users/:userId - Kullanıcı profili görüntüleme (herkese açık)
router.get('/:userId', getUserProfile);

// PUT /api/users/:userId - Kullanıcı profili güncelleme (korumalı)
router.put('/:userId', 
  authenticateToken,
  updateUserProfile
);

export default router;