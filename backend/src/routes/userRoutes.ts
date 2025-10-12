import { Router } from 'express';
import { 
  registerUser, 
  getUserProfile, 
  updateUserProfile, 
  searchUsers 
} from '../controllers/userController';

const router = Router();

// POST /api/users/register - Kullanıcı kayıt
router.post('/register', registerUser);

// GET /api/users/search - Kullanıcı arama
router.get('/search', searchUsers);

// GET /api/users/:userId - Kullanıcı profili görüntüleme
router.get('/:userId', getUserProfile);

// PUT /api/users/:userId - Kullanıcı profili güncelleme
router.put('/:userId', updateUserProfile);

export default router;