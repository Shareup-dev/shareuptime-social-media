import { Router } from 'express';
import { 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  searchUsers,
  uploadProfilePicture,
  uploadCoverPhoto
} from '../controllers/userController';
import { authenticateToken, rateLimiter, validateRequired } from '../middleware';
import { uploadSingle, handleUploadError } from '../middleware/uploadMiddleware';

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

// POST /api/users/upload/profile-picture - Profil resmi yükleme (korumalı)
router.post('/upload/profile-picture',
  authenticateToken,
  uploadSingle('profilePicture'),
  handleUploadError,
  uploadProfilePicture
);

// POST /api/users/upload/cover-photo - Kapak fotoğrafı yükleme (korumalı)
router.post('/upload/cover-photo',
  authenticateToken,
  uploadSingle('coverPhoto'),
  handleUploadError,
  uploadCoverPhoto
);

export default router;