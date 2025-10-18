# ShareUpTime Backend - Deployment ve Environment Setup

## Deployment Rehberi

Bu doküman ShareUpTime backend API'sinin farklı ortamlarda
nasıl deploy edileceğini açıklar.

## 📋 Ön Gereksinimler

### Sistem Gereksinimleri
- **Node.js:** >= 18.0.0
- **npm:** >= 8.0.0
- **RAM:** Minimum 2GB (Production için 8GB+)
- **Storage:** Minimum 10GB
- **CPU:** 2+ cores (Production için 4+ cores)

### Veritabanları
- **MongoDB:** >= 5.0 (Primary database)
- **Redis:** >= 6.0 (Caching)
- **PostgreSQL:** >= 13.0 (Optional - Alternative/Analytics)
- **Neo4J:** >= 4.0 (Optional - Graph relationships)

## 🔧 Environment Setup

### Development Environment

1. **Clone Repository:**
```bash
git clone https://github.com/Shareup-dev/shareuptime-social-media.git
cd shareuptime-social-media/backend
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Environment Variables:**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Server Configuration
NODE_ENV=development
PORT=4000
HOST=localhost

# JWT Secret
JWT_SECRET=your-super-secret-development-key
JWT_EXPIRES_IN=24h

# MongoDB
MONGO_URI=mongodb://localhost:27017/shareup_social_dev

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# PostgreSQL (Optional)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=shareup_social_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Neo4J (Optional)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (Optional)
UPLOAD_MAX_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4
```

4. **Start Development Server:**
```bash
npm run dev
```

### Production Environment

#### Option 1: Traditional Server (VPS/Dedicated)

1. **Server Setup (Ubuntu 20.04+):**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y
```

2. **Application Deployment:**
```bash
# Clone and setup
git clone https://github.com/Shareup-dev/shareuptime-social-media.git
cd shareuptime-social-media/backend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Setup environment
cp .env.example .env
# Edit .env with production values
```

3. **PM2 Configuration:**
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'shareuptime-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

4. **Nginx Configuration:**
Create `/etc/nginx/sites-available/shareuptime-api`:
```nginx
server {
    listen 80;
    server_name api.shareuptime.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

# Rate limiting zone
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/shareuptime-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. **SSL Certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.shareuptime.com
```

#### Option 2: Docker Deployment

1. **Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs package*.json ./
COPY --chown=nextjs:nodejs dist ./dist

USER nextjs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["dumb-init", "node", "dist/index.js"]
```

2. **Docker Compose:**
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/shareup_social
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped
    networks:
      - shareuptime-network

  mongo:
    image: mongo:5.0
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=secure_password
    restart: unless-stopped
    networks:
      - shareuptime-network

  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - shareuptime-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - shareuptime-network

volumes:
  mongo_data:
  redis_data:

networks:
  shareuptime-network:
    driver: bridge
```

3. **Deploy with Docker:**
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f api

# Scale API instances
docker-compose up -d --scale api=3
```

#### Option 3: Cloud Deployment (AWS/Azure/GCP)

**AWS EC2 + RDS + ElastiCache:**

1. **EC2 Instance Setup:**
```bash
# Launch Ubuntu 20.04 instance (t3.medium+)
# Security Groups: 22 (SSH), 80 (HTTP), 443 (HTTPS)

# Connect and setup
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. **RDS MongoDB Alternative (DocumentDB):**
```bash
# Use Amazon DocumentDB (MongoDB compatible)
MONGO_URI=mongodb://username:password@docdb-cluster.cluster-xxx.us-east-1.docdb.amazonaws.com:27017/shareup_social?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred
```

3. **ElastiCache Redis:**
```bash
# Use Amazon ElastiCache for Redis
REDIS_HOST=your-cluster.cache.amazonaws.com
REDIS_PORT=6379
```

4. **Application Load Balancer:**
```bash
# Configure ALB for high availability
# Target Group: EC2 instances on port 4000
# Health Check: /health endpoint
```

**Deployment Script:**
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart ecosystem.config.js --env production

# Health check
echo "🏥 Running health check..."
sleep 5
curl -f http://localhost:4000/health || exit 1

echo "✅ Deployment completed successfully!"
```

## 🔐 Security Configuration

### Production Security Checklist

- [ ] **Environment Variables:** All sensitive data in environment variables
- [ ] **HTTPS:** SSL/TLS certificate installed
- [ ] **Firewall:** Only necessary ports open (80, 443, 22)
- [ ] **Rate Limiting:** Configured at both application and nginx level
- [ ] **CORS:** Properly configured for frontend domains
- [ ] **JWT Secret:** Strong, unique secret key
- [ ] **Database:** Authentication enabled, strong passwords
- [ ] **Logs:** Proper log rotation and monitoring
- [ ] **Updates:** Regular security updates
- [ ] **Backup:** Automated database backups

### Security Headers

```javascript
// In your Express app
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 📊 Monitoring ve Logging

### Application Monitoring

```javascript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version
  };

  // Database connection checks
  try {
    await mongoose.connection.db.admin().ping();
    health.mongodb = 'Connected';
  } catch (error) {
    health.mongodb = 'Disconnected';
    health.status = 'ERROR';
  }

  // Redis connection check
  try {
    await redis.ping();
    health.redis = 'Connected';
  } catch (error) {
    health.redis = 'Disconnected';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Log Configuration

```javascript
// Winston logger setup
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'shareuptime-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🔄 Backup ve Disaster Recovery

### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# MongoDB Backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/mongo_$DATE"

# Redis Backup
redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Compress backups
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE" "$BACKUP_DIR/redis_$DATE.rdb"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://your-backup-bucket/

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

### Cron Job Setup

```bash
# Add to crontab: crontab -e
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly full backup at Sunday 1 AM
0 1 * * 0 /path/to/full_backup.sh
```

## 📈 Performance Optimization

### Production Optimizations

1. **Node.js Tuning:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'shareuptime-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    node_args: [
      '--max-old-space-size=2048',
      '--max-semi-space-size=128'
    ],
    env_production: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: 16
    }
  }]
};
```

2. **Database Connection Pooling:**
```javascript
// MongoDB connection
const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000
};

// Redis connection pooling
const redisOptions = {
  family: 4,
  keepAlive: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true
};
```

3. **Nginx Optimization:**
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_types text/css text/javascript application/javascript application/json;
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Connection keep-alive
    keepalive_timeout 65;
    keepalive_requests 100;
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Memory Leaks:**
```bash
# Monitor memory usage
pm2 monit

# Restart if memory exceeds threshold
pm2 restart app --max-memory-restart 1G
```

2. **Database Connection Issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check Redis status
redis-cli ping

# View connection pool stats
db.serverStatus().connections
```

3. **High CPU Usage:**
```bash
# Profile with clinic.js
npm install -g clinic
clinic doctor -- node dist/index.js

# Check PM2 processes
pm2 list
pm2 show app-name
```

4. **Log Analysis:**
```bash
# Real-time logs
pm2 logs --lines 100

# Error analysis
grep "ERROR" logs/combined.log | tail -50

# Performance monitoring
tail -f logs/combined.log | grep "slow"
```

## 📞 Support ve Maintenance

### Maintenance Schedule

- **Daily:** Automated backups, log rotation
- **Weekly:** Security updates, performance review
- **Monthly:** Full system update, capacity planning
- **Quarterly:** Security audit, dependency updates

### Emergency Contacts

- **DevOps Team:** `devops@shareuptime.com`
- **Database Admin:** `dba@shareuptime.com`
- **Security Team:** `security@shareuptime.com`

### Runbook

1. **API Down:**
   - Check PM2 status: `pm2 status`
   - Check logs: `pm2 logs`
   - Restart if needed: `pm2 restart all`

2. **Database Issues:**
   - Check connections: `netstat -an | grep :27017`
   - Check disk space: `df -h`
   - Check MongoDB logs: `sudo journalctl -u mongod`

3. **High Load:**
   - Scale instances: `pm2 scale app +2`
   - Check monitoring dashboards
   - Implement emergency rate limiting

---

**Son Güncelleme:** 12 Ekim 2025
**Doküman Versiyonu:** 1.0.0



### Core Features Implemented3. **Environment Variables:**

- ✅ User Authentication & Authorization (JWT)```bash

- ✅ User Profile Managementcp .env.example .env

- ✅ Real-time Messaging (WebSocket)```

- ✅ File Upload & Media Processing

- ✅ Rate Limiting & Security MiddlewareEdit `.env` file:

- ✅ Performance Monitoring```env

- ✅ Database Optimization# Server Configuration

- ✅ Caching Layer (Redis)NODE_ENV=development

PORT=4000

## 📂 Project StructureHOST=localhost



```# JWT Secret

shareuptime-social-media/JWT_SECRET=your-super-secret-development-key

├── backend/                     # Node.js/TypeScript APIJWT_EXPIRES_IN=24h

│   ├── src/

│   │   ├── controllers/         # Business logic# MongoDB

│   │   ├── routes/              # API endpointsMONGO_URI=mongodb://localhost:27017/shareup_social_dev

│   │   ├── middleware/          # Auth, validation, etc.

│   │   ├── services/            # External services# Redis (Optional)

│   │   ├── config/              # Database & app configREDIS_HOST=localhost

│   │   └── utils/               # Helper functionsREDIS_PORT=6379

│   ├── tests/                   # Jest test suiteREDIS_PASSWORD=

│   ├── uploads/                 # File storage

│   ├── Dockerfile               # Production container# PostgreSQL (Optional)

│   ├── docker-compose.prod.yml  # Production orchestrationPOSTGRES_HOST=localhost

│   ├── deploy.sh               # Deployment automationPOSTGRES_PORT=5432

│   └── nginx.conf              # Reverse proxy configPOSTGRES_DB=shareup_social_dev

└── README.mdPOSTGRES_USER=postgres

```POSTGRES_PASSWORD=password



## ⚙️ Configuration# Neo4J (Optional)

NEO4J_URI=bolt://localhost:7687

### Environment VariablesNEO4J_USER=neo4j

NEO4J_PASSWORD=password

Create production environment file:

# Email Configuration (Optional)

```bashSMTP_HOST=smtp.gmail.com

# .env.productionSMTP_PORT=587

NODE_ENV=productionSMTP_USER=your-email@gmail.com

PORT=3000SMTP_PASS=your-app-password



# Database# File Upload (Optional)

DB_HOST=postgresUPLOAD_MAX_SIZE=10485760  # 10MB

DB_PORT=5432ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4

DB_NAME=shareuptime_prod```

DB_USER=shareuptime

DB_PASSWORD=your_secure_password4. **Start Development Server:**

```bash

# Redis Cachenpm run dev

REDIS_HOST=redis```

REDIS_PORT=6379

REDIS_PASSWORD=your_redis_password### Production Environment



# JWT Authentication#### Option 1: Traditional Server (VPS/Dedicated)

JWT_SECRET=your_super_secure_jwt_secret_key_here

JWT_EXPIRY=7d1. **Server Setup (Ubuntu 20.04+):**

```bash

# File Upload# Update system

MAX_FILE_SIZE=10485760sudo apt update && sudo apt upgrade -y

UPLOAD_PATH=/app/uploads

# Install Node.js 18

# Email Service (Optional)curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

SMTP_HOST=smtp.gmail.comsudo apt-get install -y nodejs

SMTP_PORT=587

SMTP_USER=your_email@domain.com# Install PM2 for process management

SMTP_PASS=your_app_passwordsudo npm install -g pm2



# Security# Install MongoDB

RATE_LIMIT_WINDOW=900000wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

RATE_LIMIT_MAX=100echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | \

CORS_ORIGIN=https://your-domain.com  sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

```sudo apt-get update

sudo apt-get install -y mongodb-org

### SSL/TLS Certificate

# Install Redis

Place your SSL certificates in the nginx directory:sudo apt install redis-server -y



```bash# Install Nginx

mkdir -p nginx/sslsudo apt install nginx -y

# Copy your certificates```

cp your-domain.crt nginx/ssl/

cp your-domain.key nginx/ssl/2. **Application Deployment:**

``````bash

# Clone and setup

## 🚀 Deployment Processgit clone https://github.com/Shareup-dev/shareuptime-social-media.git

cd shareuptime-social-media/backend

### 1. Clone Repository

# Install dependencies

```bashnpm ci --only=production

git clone https://github.com/your-username/shareuptime-social-media.git

cd shareuptime-social-media/backend# Build application

```npm run build



### 2. Configure Environment# Setup environment

cp .env.example .env

```bash# Edit .env with production values

cp .env.example .env.production```

# Edit .env.production with your production values

nano .env.production3. **PM2 Configuration:**

```Create `ecosystem.config.js`:

```javascript

### 3. Build & Deploymodule.exports = {

  apps: [{

```bash    name: 'shareuptime-backend',

# Make deployment script executable    script: 'dist/index.js',

chmod +x deploy.sh    instances: 'max',

    exec_mode: 'cluster',

# Full production deployment    env: {

./deploy.sh latest deploy      NODE_ENV: 'development'

    },

# Or step by step:    env_production: {

./deploy.sh latest build    # Build Docker images      NODE_ENV: 'production',

./deploy.sh latest test     # Run test suite      PORT: 4000

./deploy.sh latest deploy   # Deploy to production    },

```    error_file: './logs/err.log',

    out_file: './logs/out.log',

### 4. Verify Deployment    log_file: './logs/combined.log',

    time: true,

```bash    max_memory_restart: '1G',

# Check service status    node_args: '--max-old-space-size=1024'

docker-compose -f docker-compose.prod.yml ps  }]

};

# Check logs```

docker-compose -f docker-compose.prod.yml logs

Start with PM2:

# Test API health```bash

curl https://your-domain.com/api/healthpm2 start ecosystem.config.js --env production

```pm2 save

pm2 startup

## 📊 API Endpoints```



### Authentication4. **Nginx Configuration:**

- `POST /api/auth/login` - User loginCreate `/etc/nginx/sites-available/shareuptime-api`:

- `POST /api/auth/logout` - User logout```nginx

- `GET /api/auth/verify` - Token verificationserver {

    listen 80;

### User Management    server_name api.shareuptime.com;

- `POST /api/users/register` - User registration

- `GET /api/users/:userId` - Get user profile    location / {

- `PUT /api/users/:userId` - Update user profile        proxy_pass http://localhost:4000;

- `GET /api/users/search` - Search users        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;

### Real-time Features        proxy_set_header Connection 'upgrade';

- `WebSocket /ws` - Real-time messaging        proxy_set_header Host $host;

- `POST /api/messages` - Send message        proxy_set_header X-Real-IP $remote_addr;

- `GET /api/messages/:conversationId` - Get conversation        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto $scheme;

### File Management        proxy_cache_bypass $http_upgrade;

- `POST /api/upload/profile` - Upload profile picture        

- `POST /api/upload/post` - Upload post media        # Rate limiting

- `DELETE /api/upload/:fileId` - Delete file        limit_req zone=api burst=20 nodelay;

    }

## 🔧 Operations

    # Security headers

### Monitoring    add_header X-Frame-Options "SAMEORIGIN" always;

    add_header X-XSS-Protection "1; mode=block" always;

```bash    add_header X-Content-Type-Options "nosniff" always;

# View performance metrics    add_header Referrer-Policy "no-referrer-when-downgrade" always;

curl https://your-domain.com/api/metrics}



# Database health# Rate limiting zone

docker-compose -f docker-compose.prod.yml exec postgres psql -U shareuptime -d shareuptime_prod -c "SELECT version();"http {

    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

# Redis cache status}

docker-compose -f docker-compose.prod.yml exec redis redis-cli ping```

```

Enable site:

### Backup & Recovery```bash

sudo ln -s /etc/nginx/sites-available/shareuptime-api /etc/nginx/sites-enabled/

```bashsudo nginx -t

# Database backupsudo systemctl reload nginx

./deploy.sh backup```



# Restore from backup5. **SSL Certificate (Let's Encrypt):**

docker-compose -f docker-compose.prod.yml exec postgres pg_restore -U shareuptime -d shareuptime_prod /backups/backup_YYYYMMDD.sql```bash

sudo apt install certbot python3-certbot-nginx -y

# File backupsudo certbot --nginx -d api.shareuptime.com

tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/```

```

#### Option 2: Docker Deployment

### Scaling

1. **Dockerfile:**

#### Horizontal Scaling```dockerfile

```bashFROM node:18-alpine AS builder

# Scale backend instances

docker-compose -f docker-compose.prod.yml up -d --scale backend=3WORKDIR /app

COPY package*.json ./

# Update nginx upstream in nginx.conf:RUN npm ci --only=production

upstream backend {

    server backend_1:3000;FROM node:18-alpine AS production

    server backend_2:3000;

    server backend_3:3000;WORKDIR /app

}

```# Install dumb-init for proper signal handling

RUN apk add --no-cache dumb-init

#### Database Optimization

```sql# Create non-root user

-- Add indexes for performanceRUN addgroup -g 1001 -S nodejs

CREATE INDEX CONCURRENTLY idx_users_email ON users(email);RUN adduser -S nextjs -u 1001

CREATE INDEX CONCURRENTLY idx_messages_conversation ON messages(conversation_id, created_at);

CREATE INDEX CONCURRENTLY idx_posts_user_created ON posts(user_id, created_at);# Copy built application

```COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY --chown=nextjs:nodejs package*.json ./

### SecurityCOPY --chown=nextjs:nodejs dist ./dist



#### Regular Security UpdatesUSER nextjs

```bash

# Update base imagesEXPOSE 4000

docker-compose -f docker-compose.prod.yml pull

./deploy.sh latest deployENV NODE_ENV=production

ENV PORT=4000

# Security scan

docker scan shareuptime/backend:latestCMD ["dumb-init", "node", "dist/index.js"]

``````



#### SSL/TLS Management2. **Docker Compose:**

```bash```yaml

# Renew Let's Encrypt certificatesversion: '3.8'

certbot renew --nginx

```services:

  api:

## 🔍 Troubleshooting    build: .

    ports:

### Common Issues      - "4000:4000"

    environment:

#### 1. Database Connection Failed      - NODE_ENV=production

```bash      - MONGO_URI=mongodb://mongo:27017/shareup_social

# Check PostgreSQL status      - REDIS_HOST=redis

docker-compose -f docker-compose.prod.yml logs postgres      - REDIS_PORT=6379

    depends_on:

# Verify connection      - mongo

docker-compose -f docker-compose.prod.yml exec postgres psql -U shareuptime -d shareuptime_prod -c "SELECT NOW();"      - redis

```    restart: unless-stopped

    networks:

#### 2. High Memory Usage      - shareuptime-network

```bash

# Check container resources  mongo:

docker stats    image: mongo:5.0

    volumes:

# Optimize PostgreSQL memory      - mongo_data:/data/db

# Edit postgresql.conf:    environment:

shared_buffers = 256MB      - MONGO_INITDB_ROOT_USERNAME=admin

effective_cache_size = 1GB      - MONGO_INITDB_ROOT_PASSWORD=secure_password

```    restart: unless-stopped

    networks:

#### 3. Slow API Response      - shareuptime-network

```bash

# Check API performance metrics  redis:

curl https://your-domain.com/api/metrics    image: redis:6-alpine

    command: redis-server --appendonly yes

# Enable query logging in PostgreSQL    volumes:

# Add to postgresql.conf:      - redis_data:/data

log_statement = 'all'    restart: unless-stopped

log_min_duration_statement = 1000    networks:

```      - shareuptime-network



### Emergency Procedures  nginx:

    image: nginx:alpine

#### Rollback Deployment    ports:

```bash      - "80:80"

./deploy.sh rollback      - "443:443"

```    volumes:

      - ./nginx.conf:/etc/nginx/nginx.conf

#### Emergency Shutdown      - ./ssl:/etc/nginx/ssl

```bash    depends_on:

docker-compose -f docker-compose.prod.yml down      - api

```    restart: unless-stopped

    networks:

#### Data Recovery      - shareuptime-network

```bash

# Restore from latest backupvolumes:

./deploy.sh restore latest  mongo_data:

```  redis_data:



## 📈 Performance Optimizationnetworks:

  shareuptime-network:

### Database Optimization    driver: bridge

- Connection pooling (configured)```

- Query optimization with indexes

- Regular VACUUM and ANALYZE operations3. **Deploy with Docker:**

```bash

### Caching Strategy# Build and start

- Redis for session managementdocker-compose up -d

- API response caching

- Static file caching via Nginx# View logs

docker-compose logs -f api

### Rate Limiting

- 100 requests per 15 minutes per IP# Scale API instances

- Specialized limits for auth endpointsdocker-compose up -d --scale api=3

- Configurable per environment```



## 🛡️ Security Features#### Option 3: Cloud Deployment (AWS/Azure/GCP)



### Implemented Security**AWS EC2 + RDS + ElastiCache:**

- JWT token authentication

- Password hashing with bcrypt1. **EC2 Instance Setup:**

- SQL injection prevention```bash

- XSS protection headers# Launch Ubuntu 20.04 instance (t3.medium+)

- CORS configuration# Security Groups: 22 (SSH), 80 (HTTP), 443 (HTTPS)

- Rate limiting

- File upload restrictions# Connect and setup

- Input sanitizationssh -i your-key.pem ubuntu@your-ec2-ip

```

### Security Checklist

- [ ] SSL/TLS certificates configured2. **RDS MongoDB Alternative (DocumentDB):**

- [ ] Environment variables secured```bash

- [ ] Database credentials rotated# Use Amazon DocumentDB (MongoDB compatible)

- [ ] Regular security updates appliedMONGO_URI=mongodb://username:password@docdb-cluster.cluster-xxx.us-east-1.docdb.amazonaws.com:27017/shareup_social?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred

- [ ] Log monitoring enabled```

- [ ] Backup strategy implemented

3. **ElastiCache Redis:**

## 📞 Support```bash

# Use Amazon ElastiCache for Redis

### Contact InformationREDIS_HOST=your-cluster.cache.amazonaws.com

- **Repository**: https://github.com/your-username/shareuptime-social-mediaREDIS_PORT=6379

- **Documentation**: This file and API_DOCUMENTATION.md```

- **Issues**: Use GitHub Issues for bug reports

4. **Application Load Balancer:**

### Production Support```bash

1. Check deployment logs first# Configure ALB for high availability

2. Review monitoring metrics# Target Group: EC2 instances on port 4000

3. Consult troubleshooting section# Health Check: /health endpoint

4. Create GitHub issue with detailed information```



---**Deployment Script:**

```bash

**ShareUpTime Platform** - Ready for production deployment with comprehensive monitoring, security, and scalability features.#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build application
echo "🔨 Building application..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart ecosystem.config.js --env production

# Health check
echo "🏥 Running health check..."
sleep 5
curl -f http://localhost:4000/health || exit 1

echo "✅ Deployment completed successfully!"
```

## 🔐 Security Configuration

### Production Security Checklist

- [ ] **Environment Variables:** All sensitive data in environment variables
- [ ] **HTTPS:** SSL/TLS certificate installed
- [ ] **Firewall:** Only necessary ports open (80, 443, 22)
- [ ] **Rate Limiting:** Configured at both application and nginx level
- [ ] **CORS:** Properly configured for frontend domains
- [ ] **JWT Secret:** Strong, unique secret key
- [ ] **Database:** Authentication enabled, strong passwords
- [ ] **Logs:** Proper log rotation and monitoring
- [ ] **Updates:** Regular security updates
- [ ] **Backup:** Automated database backups

### Security Headers

```javascript
// In your Express app
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## 📊 Monitoring ve Logging

### Application Monitoring

```javascript
// Health Check Endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version
  };

  // Database connection checks
  try {
    await mongoose.connection.db.admin().ping();
    health.mongodb = 'Connected';
  } catch (error) {
    health.mongodb = 'Disconnected';
    health.status = 'ERROR';
  }

  // Redis connection check
  try {
    await redis.ping();
    health.redis = 'Connected';
  } catch (error) {
    health.redis = 'Disconnected';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Log Configuration

```javascript
// Winston logger setup
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'shareuptime-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🔄 Backup ve Disaster Recovery

### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# MongoDB Backup
mongodump --uri="$MONGO_URI" --out="$BACKUP_DIR/mongo_$DATE"

# Redis Backup
redis-cli --rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Compress backups
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE" "$BACKUP_DIR/redis_$DATE.rdb"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" s3://your-backup-bucket/

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

### Cron Job Setup

```bash
# Add to crontab: crontab -e
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly full backup at Sunday 1 AM
0 1 * * 0 /path/to/full_backup.sh
```

## 📈 Performance Optimization

### Production Optimizations

1. **Node.js Tuning:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'shareuptime-backend',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    node_args: [
      '--max-old-space-size=2048',
      '--max-semi-space-size=128'
    ],
    env_production: {
      NODE_ENV: 'production',
      UV_THREADPOOL_SIZE: 16
    }
  }]
};
```

2. **Database Connection Pooling:**
```javascript
// MongoDB connection
const mongoOptions = {
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000
};

// Redis connection pooling
const redisOptions = {
  family: 4,
  keepAlive: true,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true
};
```

3. **Nginx Optimization:**
```nginx
# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;

http {
    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_types text/css text/javascript application/javascript application/json;
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Connection keep-alive
    keepalive_timeout 65;
    keepalive_requests 100;
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Memory Leaks:**
```bash
# Monitor memory usage
pm2 monit

# Restart if memory exceeds threshold
pm2 restart app --max-memory-restart 1G
```

2. **Database Connection Issues:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check Redis status
redis-cli ping

# View connection pool stats
db.serverStatus().connections
```

3. **High CPU Usage:**
```bash
# Profile with clinic.js
npm install -g clinic
clinic doctor -- node dist/index.js

# Check PM2 processes
pm2 list
pm2 show app-name
```

4. **Log Analysis:**
```bash
# Real-time logs
pm2 logs --lines 100

# Error analysis
grep "ERROR" logs/combined.log | tail -50

# Performance monitoring
tail -f logs/combined.log | grep "slow"
```

## 📞 Support ve Maintenance

### Maintenance Schedule

- **Daily:** Automated backups, log rotation
- **Weekly:** Security updates, performance review
- **Monthly:** Full system update, capacity planning
- **Quarterly:** Security audit, dependency updates

### Emergency Contacts

- **DevOps Team:** `devops@shareuptime.com`
- **Database Admin:** `dba@shareuptime.com`
- **Security Team:** `security@shareuptime.com`

### Runbook

1. **API Down:**
   - Check PM2 status: `pm2 status`
   - Check logs: `pm2 logs`
   - Restart if needed: `pm2 restart all`

2. **Database Issues:**
   - Check connections: `netstat -an | grep :27017`
   - Check disk space: `df -h`
   - Check MongoDB logs: `sudo journalctl -u mongod`

3. **High Load:**
   - Scale instances: `pm2 scale app +2`
   - Check monitoring dashboards
   - Implement emergency rate limiting

---

**Son Güncelleme:** 12 Ekim 2025
**Doküman Versiyonu:** 1.0.0