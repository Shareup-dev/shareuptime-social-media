# ShareUpTime Backend — Deployment ve Environment Setup


Bu doküman ShareUpTime backend API'sinin geliştirme ve üretim ortamlarında nasıl kurulacağı ve işletileceğini anlatır. Başlıklar tekil ve hiyerarşi kurallarına uygundur; kod blokları düzgünce kapanır.

## 📋 Ön Gereksinimler

### Sistem Gereksinimleri
- Node.js 18+
- npm 8+
- RAM: 2 GB+ (prod: 8 GB+)
- Disk: 10 GB+
- CPU: 2+ core (prod: 4+)

### Bağımlı Servisler
- MongoDB 5+
- Redis 6+
- PostgreSQL 13+ (opsiyonel)
- Neo4J 4+ (opsiyonel)

## 🔧 Geliştirme Ortamı

1) Kaynağı klonlayın
```bash
git clone https://github.com/Shareup-dev/shareuptime-social-media.git
cd shareuptime-social-media/backend
```

2) Bağımlılıkları kurun
```bash
npm install
```

3) Ortam değişkenlerini hazırlayın
```bash
cp .env.example .env
```

`.env` içeriği örnek:
```env
NODE_ENV=development
PORT=4000
HOST=localhost

JWT_SECRET=dev-secret
JWT_EXPIRES_IN=24h

MONGO_URI=mongodb://localhost:27017/shareup_social_dev

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

4) Geliştirme sunucusunu çalıştırın
```bash
npm run dev
```

## 🚀 Üretim Ortamı

### Seçenek 1: VPS (PM2 + Nginx)

1) Sunucu hazırlığı (Ubuntu 20.04+)
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm install -g pm2
```

2) Uygulama kurulumu
```bash
git clone https://github.com/Shareup-dev/shareuptime-social-media.git
cd shareuptime-social-media/backend
npm ci --only=production
npm run build
cp .env.example .env
# .env içeriklerini prod değerlerinizle güncelleyin
```

3) PM2 yapılandırması (`ecosystem.config.js`)
```javascript
module.exports = {
  apps: [{
    name: 'shareuptime-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: { NODE_ENV: 'production', PORT: 4000 },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    max_memory_restart: '1G'
  }]
}
```

PM2 ile başlatın:
```bash
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup
```

4) Nginx site ayarı (`/etc/nginx/sites-available/shareuptime-api`)
```nginx
server {
  listen 80;
  server_name api.shareuptime.com;

  location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Etkinleştirme ve test:
```bash
sudo ln -s /etc/nginx/sites-available/shareuptime-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

SSL (Let's Encrypt):
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.shareuptime.com
```

### Seçenek 2: Docker Compose

`docker-compose.yml` örneği:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports: ["4000:4000"]
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://mongo:27017/shareup_social
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on: [mongo, redis]
    restart: unless-stopped
  mongo:
    image: mongo:5.0
    volumes: ["mongo_data:/data/db"]
    restart: unless-stopped
  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes: ["redis_data:/data"]
    restart: unless-stopped
volumes:
  mongo_data:
  redis_data:
```

Çalıştırma:
```bash
docker-compose up -d
docker-compose logs -f api
```

### Seçenek 3: Bulut (AWS örneği)

- EC2 üzerinde uygulama (VPS adımlarıyla aynı)
- DocumentDB (Mongo uyumlu) ve ElastiCache (Redis)
- ALB ile `/health` kontrolü

Örnek değişkenler:
```env
MONGO_URI=mongodb://user:pass@docdb-host:27017/shareup_social?ssl=true
REDIS_HOST=your-cluster.cache.amazonaws.com
REDIS_PORT=6379
```

## 🛡️ Güvenlik Yapılandırması

### Üretim Kontrol Listesi
- [ ] Ortam değişkenleri gizli ve yönetiliyor
- [ ] HTTPS etkin, sertifikalar güncel
- [ ] Güvenlik grupları/Firewall daraltılmış
- [ ] Oran sınırlama (rate limit) aktif
- [ ] CORS sadece izinli alan adları
- [ ] Güçlü JWT sırrı
- [ ] Veritabanı kimlik doğrulama ve güçlü parolalar
- [ ] Log rotasyonu ve izleme
- [ ] Düzenli güvenlik güncellemeleri
- [ ] Otomatik yedekleme

### Güvenlik Başlıkları (Express)
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 📊 İzleme ve Loglama

### Health Check Örneği
```javascript
app.get('/health', async (req, res) => {
  res.json({ status: 'OK', ts: new Date().toISOString() });
});
```

### Winston Logger
```javascript
import winston from 'winston';
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.Console()]
});
```

## 🔄 Yedekleme ve Felaket Kurtarma

### Basit Yedekleme Betiği
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/mongo_$DATE"
redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"
tar -czf "$BACKUP_DIR/backup_$DATE.tgz" "$BACKUP_DIR/mongo_$DATE" "$BACKUP_DIR/redis_$DATE.rdb"
```

### Cron Örneği
```bash
0 2 * * * /path/to/backup.sh
```

## 📈 Performans İyileştirme

### PM2/Node Ayarları
```javascript
module.exports = {
  apps: [{
    name: 'shareuptime-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
```

### Bağlantı Havuzu
```javascript
const mongoOptions = { maxPoolSize: 50, minPoolSize: 5 };
```

## 🚨 Sorun Giderme

- PM2 durum: `pm2 status`
- Günlükler: `pm2 logs`
- Mongo: `sudo systemctl status mongod`
- Redis: `redis-cli ping`

## 📞 Destek ve Bakım

### Bakım Takvimi
- Günlük: Yedekleme, log rotasyonu
- Haftalık: Güvenlik güncellemesi, performans gözden geçirme
- Aylık: Kapasite planlama

### İletişim
- DevOps: devops [at] shareuptime.com
- DBA: dba [at] shareuptime.com
- Güvenlik: security [at] shareuptime.com

---

Son Güncelleme: 18 Ekim 2025 — Doküman Sürümü: 1.1.0