import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import postRoutes from './routes/postRoutes';
import followRoutes from './routes/followRoutes';
import { requestLogger } from './middleware';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// CORS ayarları (geliştirme için)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Ana route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ShareUpTime Backend API Çalışıyor!',
    version: '1.0.0',
    endpoints: {
      users: {
        base: '/api/users',
        endpoints: [
          'POST /register - Kullanıcı kayıt',
          'GET /search - Kullanıcı arama',
          'GET /:userId - Kullanıcı profili görüntüleme',
          'PUT /:userId - Kullanıcı profili güncelleme (korumalı)'
        ]
      },
      auth: {
        base: '/api/auth',
        endpoints: [
          'POST /login - Kullanıcı girişi',
          'GET /verify - Token doğrulama (korumalı)',
          'POST /change-password - Şifre değiştirme (korumalı)',
          'POST /request-password-reset - Şifre sıfırlama talebi'
        ]
      },
      posts: {
        base: '/api/posts',
        endpoints: [
          'POST / - Gönderi oluştur (korumalı)',
          'GET / - Gönderileri listele',
          'GET /:postId - Belirli gönderiyi getir',
          'GET /user/:userId - Kullanıcının gönderilerini getir',
          'PUT /:postId - Gönderi güncelle (korumalı)',
          'DELETE /:postId - Gönderi sil (korumalı)'
        ]
      },
      follows: {
        base: '/api/follows',
        endpoints: [
          'POST /:userId - Kullanıcıyı takip et (korumalı)',
          'DELETE /:userId - Kullanıcıyı takipten çık (korumalı)',
          'GET /:userId/followers - Takipçileri listele',
          'GET /:userId/following - Takip edilenleri listele',
          'GET /:userId/status - Takip durumunu kontrol et (korumalı)',
          'GET /:userId/mutual - Ortak takip edilenleri getir (korumalı)'
        ]
      }
    },
    features: [
      'JWT Kimlik Doğrulama',
      'Rate Limiting',
      'Input Validation & Sanitization',
      'Mongoose ODM',
      'Request Logging',
      'Error Handling'
    ]
  });
});

// API rotaları
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follows', followRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint bulunamadı',
    requestedPath: req.originalUrl
  });
});

// Hata yakalama middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Sunucu hatası:', err);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
});

const PORT = process.env.PORT || 4000;

// Veritabanı bağlantıları ve sunucu başlatma
const startServer = async () => {
  // Sunucuyu önce başlat
  app.listen(PORT, () => {
    console.log(`ShareUpTime Backend API ${PORT} portunda çalışıyor.`);
    console.log(`API Dokümantasyon: http://localhost:${PORT}/`);
  });

  // Veritabanı bağlantılarını asenkron olarak yap
  try {
    const { initializeDatabase } = await import('./config/database');
    await initializeDatabase();
  } catch (dbError) {
    console.warn('Veritabanı modülü yüklenemedi, temel API özellikleri çalışacak');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Sunucu kapatılıyor...');
  try {
    // Redis bağlantısı varsa kapat
    try {
      const { redisClient } = await import('./config/database');
      if (redisClient.isOpen) {
        await redisClient.quit();
        console.log('Redis bağlantısı kapatıldı');
      }
    } catch {
      // Redis modülü yüklenemezse veya bağlantı yoksa görmezden gel
    }
    process.exit(0);
  } catch (error) {
    console.error('Kapatma hatası:', error);
    process.exit(1);
  }
});

startServer();
