import express from 'express';

import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware';

const router = express.Router();

// Bildirim endpoints
router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadNotificationCount);
router.put('/:notificationId/read', authenticateToken, markNotificationAsRead);
router.put('/mark-all-read', authenticateToken, markAllNotificationsAsRead);

export default router;
