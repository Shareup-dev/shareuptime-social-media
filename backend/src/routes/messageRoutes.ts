import express from 'express';
import {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markMessageAsRead
} from '../controllers/messageController';
import { authenticateToken } from '../middleware';
import { uploadMessage, handleUploadError } from '../middleware/uploadMiddleware';

const router = express.Router();

// Konuşma yönetimi
router.post('/conversations', authenticateToken, getOrCreateConversation);
router.get('/conversations', authenticateToken, getUserConversations);

// Mesaj yönetimi
router.post('/conversations/:conversationId/messages', 
  authenticateToken,
  uploadMessage,
  handleUploadError,
  sendMessage
);
router.get('/conversations/:conversationId/messages', authenticateToken, getConversationMessages);
router.put('/messages/:messageId/read', authenticateToken, markMessageAsRead);

export default router;