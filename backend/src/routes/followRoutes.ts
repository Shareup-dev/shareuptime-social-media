import { Router } from 'express';

import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getMutualFollowers,
} from '../controllers/followController';
import { authenticateToken, rateLimiter } from '../middleware';

const router = Router();

// POST /api/follows/:userId - Kullanıcıyı takip et (korumalı)
router.post(
  '/:userId',
  authenticateToken,
  rateLimiter(50, 60 * 60 * 1000), // Saatte max 50 takip işlemi
  followUser,
);

// DELETE /api/follows/:userId - Kullanıcıyı takipten çık (korumalı)
router.delete('/:userId', authenticateToken, unfollowUser);

// GET /api/follows/:userId/followers - Kullanıcının takipçilerini listele (herkese açık)
router.get('/:userId/followers', getFollowers);

// GET /api/follows/:userId/following - Kullanıcının takip ettiklerini listele (herkese açık)
router.get('/:userId/following', getFollowing);

// GET /api/follows/:userId/status - Takip durumunu kontrol et (korumalı)
router.get('/:userId/status', authenticateToken, checkFollowStatus);

// GET /api/follows/:userId/mutual - Ortak takip edilenleri getir (korumalı)
router.get('/:userId/mutual', authenticateToken, getMutualFollowers);

export default router;
