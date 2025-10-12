import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
      users: '/api/users',
      auth: '/api/auth',
      posts: '/api/posts',
      follows: '/api/follows'
    }
  });
});

// API rotaları
app.use('/api/users', userRoutes);

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
    const { connectMongo, redisClient } = await import('./config/database');
    
    // MongoDB bağlantısı
    await connectMongo();
    
    // Redis bağlantısı  
    try {
      await redisClient.connect();
      console.log('Redis bağlantısı başarılı');
    } catch (redisError) {
      console.warn('Redis bağlantısı başarısız, cache özelliği kullanılamayacak');
    }
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
