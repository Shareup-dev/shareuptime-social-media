import { Router } from 'express';
import { 
  loginUser, 
  verifyTokenEndpoint, 
  changePassword, 
  requestPasswordReset 
} from '../controllers/authController';
import { authenticateToken, rateLimiter, validateRequired } from '../middleware';

const router = Router();

// POST /api/auth/login - Kullanıcı girişi
router.post('/login', 
  rateLimiter(5, 15 * 60 * 1000), // 15 dakikada max 5 giriş denemesi
  validateRequired(['email', 'password']),
  loginUser
);

// GET /api/auth/verify - Token doğrulama
router.get('/verify', 
  authenticateToken, 
  verifyTokenEndpoint
);

// POST /api/auth/change-password - Şifre değiştirme
router.post('/change-password', 
  authenticateToken,
  validateRequired(['currentPassword', 'newPassword']),
  changePassword
);

// POST /api/auth/request-password-reset - Şifre sıfırlama talebi
router.post('/request-password-reset', 
  rateLimiter(3, 60 * 60 * 1000), // Saatte max 3 şifre sıfırlama talebi
  validateRequired(['email']),
  requestPasswordReset
);

export default router;