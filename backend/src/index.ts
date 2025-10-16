import { createServer } from 'http';
import path from 'path';

import dotenv from 'dotenv';
import express from 'express';

import { requestLogger, rateLimiter } from './middleware';
import { performanceMiddleware } from './middleware/performanceMiddleware';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import followRoutes from './routes/followRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';
import postRoutes from './routes/postRoutes';
import userRoutes from './routes/userRoutes';
import ShareUpTimeWebSocket from './services/websocket';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();
const server = createServer(app);

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security Headers Middleware
app.use((req, res, next) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Remove Express powered by header
  res.removeHeader('X-Powered-By');

  next();
});

// Body parsing middleware with size limits
app.use(
  express.json({
    limit: '10mb',
    strict: true,
    type: 'application/json',
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  }),
);

// Request logging
app.use(requestLogger);

// Performance monitoring
app.use(performanceMiddleware);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting - genel API rate limit
app.use('/api/', rateLimiter(100, 15 * 60 * 1000)); // 100 requests per 15 minutes

// Auth endpoints için özel rate limiting
app.use('/api/auth/login', rateLimiter(5, 15 * 60 * 1000)); // 5 login attempts per 15 minutes
app.use('/api/users/register', rateLimiter(3, 60 * 60 * 1000)); // 3 registrations per hour

// CORS ayarları (production için güvenli)
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? ['https://shareuptime.com', 'https://www.shareuptime.com']
    : ['http://localhost:3000', 'http://localhost:8081', 'exp://192.168.1.100:8081'];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control',
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Input sanitization middleware
app.use((req, res, next) => {
  // Recursively sanitize all string inputs
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj.trim().replace(/[<>]/g, ''); // Basic XSS prevention
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    return obj;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
});

// Ana route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShareUpTime Backend API Çalışıyor!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      users: {
        base: '/api/users',
        endpoints: [
          'POST /register - Kullanıcı kayıt (Rate Limited)',
          'GET /search - Kullanıcı arama',
          'GET /:userId - Kullanıcı profili görüntüleme',
          'PUT /:userId - Kullanıcı profili güncelleme (korumalı)',
        ],
      },
      auth: {
        base: '/api/auth',
        endpoints: [
          'POST /login - Kullanıcı girişi (Rate Limited)',
          'GET /verify - Token doğrulama (korumalı)',
          'POST /change-password - Şifre değiştirme (korumalı)',
          'POST /request-password-reset - Şifre sıfırlama talebi',
        ],
      },
      posts: {
        base: '/api/posts',
        endpoints: [
          'POST / - Gönderi oluştur (korumalı)',
          'GET / - Gönderileri listele',
          'GET /:postId - Belirli gönderiyi getir',
          'GET /user/:userId - Kullanıcının gönderilerini getir',
          'PUT /:postId - Gönderi güncelle (korumalı)',
          'DELETE /:postId - Gönderi sil (korumalı)',
        ],
      },
      follows: {
        base: '/api/follows',
        endpoints: [
          'POST /:userId - Kullanıcıyı takip et (korumalı)',
          'DELETE /:userId - Kullanıcıyı takipten çık (korumalı)',
          'GET /:userId/followers - Takipçileri listele',
          'GET /:userId/following - Takip edilenleri listele',
          'GET /:userId/status - Takip durumunu kontrol et (korumalı)',
          'GET /:userId/mutual - Ortak takip edilenleri getir (korumalı)',
        ],
      },
      messages: {
        base: '/api/messages',
        endpoints: [
          'POST /conversations - Konuşma oluştur/getir (korumalı)',
          'GET /conversations - Kullanıcının konuşmaları (korumalı)',
          'POST /conversations/:conversationId/messages - Mesaj gönder (korumalı)',
          'GET /conversations/:conversationId/messages - Konuşma mesajları (korumalı)',
          'PUT /messages/:messageId/read - Mesajı okundu işaretle (korumalı)',
        ],
      },
      notifications: {
        base: '/api/notifications',
        endpoints: [
          'GET / - Kullanıcının bildirimleri (korumalı)',
          'GET /unread-count - Okunmamış bildirim sayısı (korumalı)',
          'PUT /:notificationId/read - Bildirimi okundu işaretle (korumalı)',
          'PUT /mark-all-read - Tüm bildirimleri okundu işaretle (korumalı)',
        ],
      },
      admin: {
        base: '/api/admin',
        endpoints: [
          'GET /performance - Sistem performans metrikleri (admin)',
          'GET /database - Database istatistikleri (admin)',
          'GET /cache - Cache istatistikleri (admin)',
          'GET /health - Sistem sağlık durumu (admin)',
          'POST /cache/clear - Cache temizleme (admin)',
          'GET /logs - Son logları görüntüle (admin)',
        ],
      },
    },
    security: [
      'JWT Authentication',
      'Rate Limiting (Global & Endpoint Specific)',
      'Input Validation & Sanitization',
      'XSS Protection',
      'CORS Protection',
      'Security Headers',
      'Request Size Limits',
      'SQL Injection Prevention',
    ],
    features: [
      'PostgreSQL Database',
      'MongoDB Fallback',
      'Redis Caching',
      'Request Logging',
      'Error Handling',
      'Graceful Shutdown',
    ],
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API rotaları
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı',
    requestedPath: req.originalUrl,
    availableEndpoints: [
      '/api/users',
      '/api/auth',
      '/api/posts',
      '/api/follows',
      '/api/messages',
      '/api/notifications',
      '/api/admin',
    ],
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Sunucu hatası:', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 4000;

// Veritabanı bağlantıları ve sunucu başlatma
const startServer = async () => {
  // WebSocket servisini başlat
  const wsService = new ShareUpTimeWebSocket(server);

  // Sunucuyu başlat
  const serverInstance = server.listen(PORT, () => {
    console.log(`🚀 ShareUpTime Backend API ${PORT} portunda çalışıyor.`);
    console.log(`📋 API Dokümantasyon: http://localhost:${PORT}/`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log(`🛡️  Security: Enhanced security measures active`);
    console.log(`📡 WebSocket: Real-time features enabled`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Veritabanı bağlantıları asenkron olarak yap
  try {
    const { initializeDatabase } = await import('./config/database');
    await initializeDatabase();

    // Cache service'i initialize et
    const { CacheService } = await import('./services/cacheService');
    await CacheService.initialize();
  } catch (dbError) {
    console.warn('⚠️  Veritabanı modülü yüklenemedi, temel API özellikleri çalışacak');
  }

  // WebSocket servisini global olarak erişilebilir yap
  (global as any).wsService = wsService;

  return { server: serverInstance, websocket: wsService };
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Sunucu kapatılıyor...');
  try {
    // Redis bağlantısı varsa kapat
    try {
      const { redisClient } = await import('./config/database');
      if (redisClient.isOpen) {
        await redisClient.quit();
        console.log('✅ Redis bağlantısı kapatıldı');
      }
    } catch {
      // Redis modülü yüklenemezse veya bağlantı yoksa görmezden gel
    }

    console.log('✅ Sunucu başarıyla kapatıldı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Kapatma hatası:', error);
    process.exit(1);
  }
});

startServer();
