# ShareUpTime Backend API

Bu klasör, ShareUpTime sosyal medya platformunun Node.js (Express.js,
TypeScript) tabanlı backend API'sini içerir.

Hızlı bağlantılar:

- API Dokümanı: ./API_DOCUMENTATION.md
- Veritabanı Şemaları: ./DATABASE_SCHEMA.md
- Deployment Rehberi: ./DEPLOYMENT.md
- Değişiklik Günlüğü: ./CHANGELOG.md
- Sağlık Kontrolleri: GET /health, GET /

## 🚀 Özellikler

- ✅ **Kullanıcı Yönetimi**: Kayıt, giriş, profil yönetimi
- ✅ **Kimlik Doğrulama**: JWT tabanlı güvenli kimlik doğrulama
- ✅ **Gönderi Sistemi**: CRUD işlemleri, medya desteği
- ✅ **Takip Sistemi**: Kullanıcı takip/çıkma, takipçi listeleri
- ✅ **Real-time Mesajlaşma**: WebSocket ile anlık mesajlaşma
- ✅ **File Upload**: Medya yükleme ve işleme (profil, gönderi)
- ✅ **Rate Limiting**: API güvenliği ve kaynak korunması
- ✅ **Performance Monitoring**: Gerçek zamanlı performans metrikleri
- ✅ **Veritabanı Desteği**: MongoDB, PostgreSQL, Redis, Neo4J
- ✅ **TypeScript**: Tip güvenliği ve modern JavaScript
- ✅ **Production Docker**: Multi-stage Docker build
- ✅ **Modüler Mimari**: Temiz kod ve bakım kolaylığı

## 📋 Gereksinimler

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (optional, for data persistence)
- Redis (optional, for caching)
- PostgreSQL (recommended, for relational data)
- Neo4J (optional, for graph relationships)

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Ortam değişkenlerini ayarlayın:**
   ```bash
   cp .env.example .env
   # .env dosyasını düzenleyin
   ```

3. **Geliştirme modunda başlatın:**
   ```bash
   npm run dev
   ```

4. **Production için derleyin:**
   ```bash
   npm run build
   npm start
   ```

## 🧰 Geliştirme Komutları (Hızlı Rehber)

  Aşağıdaki komutlar; hem backend hem de mobile-app için tip/format/lint
  kontrollerini hızlıca çalıştırmanıza yardımcı olur.

  Backend (bu klasör):

  ```
  # Tipik akış
  npm install
  npm run lint
  npm run format
  npm run build

  # Otomatik düzeltme (gerekirse)
  npm run lint:fix
  npm run format:fix
  ```

  Mobile app (kardeş klasör):

  ```
  cd ../mobile-app
  npm install
  npm run type-check
  npm run lint
  # (isteğe bağlı) npm run lint:fix
  ```

  Not: Mobile lint kuralları bilerek katıdır ve çok sayıda uyarı
  raporlayabilir; UI/UX’e dokunmayan küçük ve güvenli partiler halinde ele
  alıyoruz.

## ⚡ Hızlı Başlangıç (Quick Start)

Geliştirme ortamında arka ucu ve mobil Metro sunucusunu hızlıca başlatmak için:

```bash
# Backend
cd backend
npm install
npm run dev  # <http://localhost:4000/health>

# Yeni bir terminalde Metro
cd ../mobile-app
npm install
npm start  # <http://localhost:8081>
```

## 🐳 Docker ile Çalıştırma (Opsiyonel)

Production benzeri ortamda Docker ile çalıştırmak için:

```bash
# Backend klasöründe
docker compose -f docker-compose.prod.yml up --build -d

# Logları görmek için
docker compose -f docker-compose.prod.yml logs -f
```

Notlar:
- .env dosyanızı `backend/.env` konumunda oluşturun (örnek için `.env.example`).
- Dockerfile multi-stage build içerir.

Mobil uygulamayı cihaz/emülatörde çalıştırmak için (isteğe bağlı):

```bash
# Android
npm run android

# iOS (macOS)
npm run pod-install
npm run ios
```

Varsayılan API tabanı ve WebSocket adresleri (mobile-app için):

```
API: http://localhost:4000/api
WS:  http://localhost:4000
```

Sağlık kontrolleri:

```
GET http://localhost:4000/health
GET http://localhost:4000/
```

## 🧾 Mobil Uygulama UI Envanteri (Güncel)

Son tarama sonuçları:

- Ekran (Screens): 73
- Bileşen (Components): 143
- Varlık (Assets): 452

Bu sayıların amacı, kapsama ve temizlik çalışmalarını küçük partilerde
planlamaktır. Değerler düzenli aralıklarla güncellenecektir.

## 🗄️ Arşiv Politikası

Eski/legacy dosyalar silinmek yerine arşivlenir:

- Arşiv yolu: `docs/archive/`
- Örnek: `mobile-app/app/services/old/*` → `docs/archive/mobile-app/app/services/old/*`

Son hareket:
- `DEPLOYMENT.md.backup` dosyası `docs/archive/DEPLOYMENT.md.backup`
  konumuna taşındı (içerik korunarak). Runtime davranışı etkilenmedi.

Ek not: `docs/archive/` ve diğer büyük klasörler markdownlint kapsamı dışında
tutulmuştur (bkz. `.markdownlintignore`). Bu yalnızca dokümantasyon lint
gürültüsünü azaltmak içindir; kod kalitesi denetimleri ve build akışı
değişmemiştir.

Bu yaklaşım, değişiklikleri tersine çevirmeyi kolaylaştırır ve PR’ları daha
okunur kılar.

## 🧭 Sonraki Adımlar (Kısa Plan)

- Legacy/backup dosyaları için ikinci hafif tarama ve arşivleme
- Reactions/TabView etrafında kademeli tip daraltma (UI davranışını etkilemeden)
- Küçük lint/hijyen iyileştirmeleri (örn. kullanılmayan değişkenler)
- Dokümantasyonun periyodik güncellenmesi (envanter/komutlar)

### Hızlı Dene (cURL)

```
# Sağlık kontrolü
curl -s http://localhost:4000/health | jq .

# Ana sayfa JSON
curl -s http://localhost:4000/ | jq .

# Örnek kullanıcı arama
curl -s "http://localhost:4000/api/users/search?q=john" | jq .
```

### WebSocket (Socket.IO) Hızlı Test

Node REPL veya küçük bir script ile test edebilirsiniz:

<!-- markdownlint-disable MD013 -->
```
node -e "(async()=>{const {io}=await import('socket.io-client'); const s=io('http://localhost:4000',{transports:['websocket']}); s.on('connect',()=>console.log('connected',s.id)); s.on('connect_error',e=>console.error('ws error',e.message)); setTimeout(()=>s.close(),2000);})();"
```
<!-- markdownlint-enable MD013 -->

## 🧭 Mimari ve Dosya Haritası (Backend)

Uygulamanın backend tarafında temel katmanlar ve dosya konumları:

```
src/
├── index.ts              # Uygulama giriş noktası (Express + Socket.IO bootstrap)
├── config/               # Konfigürasyon ve şemalar
│   ├── database.ts       # DB bağlantıları (MongoDB/PostgreSQL/Redis/Neo4J opsiyonları)
│   ├── shareuptime_schema.sql  # PostgreSQL canonical şema
│   ├── schema.sql        # Minimal örnek şema
│   └── performance_indexes.sql # Ek indeksler ve görünümler
├── controllers/          # İş mantığı (request -> response)
│   ├── authController.ts
│   ├── postController.ts
│   ├── userController.ts
│   ├── commentController.ts
│   ├── followController.ts
│   ├── messageController.ts
│   └── notificationController.ts
├── routes/               # API rotaları (Express Router)
│   ├── authRoutes.ts
│   ├── postRoutes.ts
│   ├── userRoutes.ts
│   ├── commentRoutes.ts      # (varsa)
│   ├── followRoutes.ts
│   ├── messageRoutes.ts
│   ├── notificationRoutes.ts
│   └── adminRoutes.ts
├── middleware/           # Ortak middleware'ler
│   ├── index.ts
│   ├── performanceMiddleware.ts
│   └── uploadMiddleware.ts
├── services/             # Servis ve yardımcı katman
│   ├── cacheService.ts   # Redis/Cache yardımcıları
│   ├── emailService.ts   # E-posta gönderimi
│   └── websocket.ts      # Socket.IO sunucusu
├── models/               # (Gerekirse) veri modeli yardımcıları
│   └── index.ts
├── types/                # Tip tanımları ve Express genişletmeleri
│   ├── index.ts
│   └── express.d.ts
└── utils/                # Genel yardımcı fonksiyonlar
    └── index.ts
```

İlgili referans dokümanlar:
- API son-noktaları: `API_DOCUMENTATION.md`
- Veritabanı şemaları: `DATABASE_SCHEMA.md`
- Dağıtım notları: `DEPLOYMENT.md` (yedek kopya: `docs/archive/DEPLOYMENT.md.backup`)
## 🛠️ Sorun Giderme (Troubleshooting)

- 400/401 hataları: Authorization header veya body şemasını doğrulayın.
- CORS hatası: `NODE_ENV` ve `allowedOrigins` listesini kontrol edin.
- 429 Too Many Requests: Rate limiting devrede—bir süre bekleyin.
- 500 hatası: Sunucu loglarını ve global error handler çıktısını inceleyin.

## 🔗 API Endpoints

### Kullanıcı İşlemleri (`/api/users`)
- `POST /register` - Kullanıcı kayıt
- `GET /search` - Kullanıcı arama
- `GET /:userId` - Profil görüntüleme
- `PUT /:userId` - Profil güncelleme (🔒)

### Kimlik Doğrulama (`/api/auth`)
- `POST /login` - Kullanıcı girişi
- `GET /verify` - Token doğrulama (🔒)
- `POST /change-password` - Şifre değiştirme (🔒)
- `POST /request-password-reset` - Şifre sıfırlama

### Gönderiler (`/api/posts`)
- `POST /` - Gönderi oluştur (🔒)
- `GET /` - Gönderileri listele
- `GET /:postId` - Gönderi detayı
- `GET /user/:userId` - Kullanıcının gönderileri
- `PUT /:postId` - Gönderi güncelle (🔒)
- `DELETE /:postId` - Gönderi sil (🔒)

### Takip Sistemi (`/api/follows`)
- `POST /:userId` - Takip et (🔒)
- `DELETE /:userId` - Takipten çık (🔒)
- `GET /:userId/followers` - Takipçiler
- `GET /:userId/following` - Takip edilenler
- `GET /:userId/status` - Takip durumu (🔒)
- `GET /:userId/mutual` - Ortak takipler (🔒)

🔒 = Kimlik doğrulama gerekli

## 🔧 NPM Scripts

- `npm run dev` - Geliştirme sunucusu (hot reload)
- `npm run build` - Production build
- `npm start` - Production sunucusu başlat
- `npm run clean` - Dist klasörünü temizle
- `npm run prod` - Build + Start

## 🌍 Ortam Değişkenleri

```env
# Sunucu
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key

# MongoDB
MONGO_URI=mongodb://localhost:27017/shareup_social

# Redis (Cache)
REDIS_HOST=localhost
REDIS_PORT=6379

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=shareup_social
POSTGRES_USER=admin
POSTGRES_PASSWORD=password

# Neo4J (Graph DB)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```

## 🧪 Test Etme

API'yi test etmek için:

```bash
# Sunucuyu başlat
npm run dev

# Ana endpoint test
curl http://localhost:4000

# Kullanıcı kayıt test
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

## 🚦 Durum Kodları

- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Geçersiz istek
- `401` - Kimlik doğrulama gerekli
- `403` - Yetkisiz
- `404` - Bulunamadı
- `409` - Çakışma (duplicate)
- `429` - Çok fazla istek
- `500` - Sunucu hatası

## 🔒 Güvenlik

- JWT kimlik doğrulama
- Bcrypt şifre hashleme
- Rate limiting
- Input validation & sanitization
- CORS yapılandırması
- SQL injection korunması

## 📝 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📚 Detaylı Dokümantasyon

Bu proje kapsamlı dokümantasyona sahiptir:

- **[API Dokümantasyonu](./API_DOCUMENTATION.md)** - Tüm endpoint'ler,
  request/response formatları ve örnekler
- **[Veritabanı Şemaları](./DATABASE_SCHEMA.md)** - MongoDB, PostgreSQL,
  Redis ve Neo4J veri modelleri
- **[Deployment Rehberi](./DEPLOYMENT.md)** - Production deployment,
  güvenlik ve monitoring
- **[Environment Setup](./.env.example)** - Tüm environment değişkenleri

## 🛠️ Frontend Geliştirme İçin

Frontend geliştiriciler için hazır API:

### Temel URL
```
Development: http://localhost:4000/api
Production: https://api.shareuptime.com/api
```

### Kimlik Doğrulama
```javascript
headers: {
  'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
  'Content-Type': 'application/json'
}
```

### Örnek Kullanım
```javascript
// Kullanıcı kaydı
const response = await fetch('/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'kullaniciadi',
    email: 'email@ornek.com',
    password: '123456',
    fullName: 'Tam Ad'
  })
});

// Gönderileri getir
const posts = await fetch('/api/posts?page=1&limit=10');
const data = await posts.json();
```

Daha fazla örnek için [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) dosyasına bakın.

## 🎯 Özellik Roadmap

### ✅ Tamamlanan Özellikler
- Kullanıcı kayıt/giriş sistemi
- JWT kimlik doğrulama
- Post CRUD işlemleri
- Takip sistemi
- Rate limiting ve güvenlik
- Multi-database desteği

### 🚧 Geliştirme Aşamasında
- Real-time bildirimler (WebSocket)
- Medya dosya yükleme sistemi
- Gelişmiş arama ve filtreleme
- Analytics dashboard

### 📋 Planlanan Özellikler
- Direct messaging
- Story özelliği
- Live streaming
- Mobile push notifications
- Advanced moderation tools

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'i push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

### Geliştirme Kuralları
- TypeScript kullanın
- ESLint kurallarına uyun
- Unit testler yazın
- API dokümantasyonunu güncelleyin
- Commit mesajlarında Türkçe veya İngilizce kullanın

## 📞 İletişim ve Destek

**Shareup-dev** - [GitHub](https://github.com/Shareup-dev)

Proje Linki: [https://github.com/Shareup-dev/shareuptime-social-media](https://github.com/Shareup-dev/shareuptime-social-media)

### Hızlı Başlangıç Desteği
- 🚨 **Acil Sorunlar:** GitHub Issues açın
- 💬 **Genel Sorular:** Discussions bölümünü kullanın
- 📧 **İş Birliği:** Email ile iletişime geçin
- 📱 **Frontend Entegrasyonu:** API dokümantasyonunu inceleyin

**Frontend geliştirme için hazır! 🎉**
