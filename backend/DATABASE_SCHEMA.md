# ShareUpTime Backend - Veri Modelleri ve Şemalar

## 📊 Veritabanı Şemaları

Bu belge, ShareUpTime backend projesinde kullanılan veri modellerini ve veritabanı şemalarını detaylandırır.

## 🗃️ MongoDB Modelleri (Mongoose)

### User Modeli

```typescript
interface IUser {
  _id: ObjectId;
  username: string;        // Benzersiz kullanıcı adı
  email: string;          // Benzersiz e-posta
  password: string;       // Hash'lenmiş şifre
  fullName: string;       // Tam ad
  bio?: string;           // Kullanıcı biyografisi
  profilePicture?: string; // Profil resmi URL'si
  isVerified: boolean;    // E-posta doğrulama durumu
  isActive: boolean;      // Hesap aktiflik durumu
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexler:**

- `username` (unique)
- `email` (unique)
- `createdAt` (-1)

**Validation:**

- `username`: 3-30 karakter, alfanumerik ve _
- `email`: Geçerli e-posta formatı
- `password`: Minimum 6 karakter (hash'lenmeden önce)
- `fullName`: 2-100 karakter

---

### Post Modeli

```typescript
interface IPost {
  _id: ObjectId;
  author: ObjectId;       // User referansı
  content: string;        // Gönderi içeriği
  media?: Array<{         // Medya dosyaları
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  }>;
  tags?: string[];        // Hashtag'ler
  mentions?: ObjectId[];  // Bahsedilen kullanıcılar
  likeCount: number;      // Beğeni sayısı
  commentCount: number;   // Yorum sayısı
  shareCount: number;     // Paylaşım sayısı
  isDeleted: boolean;     // Soft delete
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexler:**
- `author` + `createdAt` (-1)
- `tags` (multikey)
- `createdAt` (-1)
- `likeCount` (-1)

**Validation:**
- `content`: 1-2000 karakter
- `tags`: Maksimum 10 tag, her biri 2-50 karakter
- `media`: Maksimum 10 dosya

---

### Follow Modeli

```typescript
interface IFollow {
  _id: ObjectId;
  follower: ObjectId;     // Takip eden kullanıcı
  following: ObjectId;    // Takip edilen kullanıcı
  createdAt: Date;
}
```

**Indexler:**
- `follower` + `following` (unique compound)
- `follower` + `createdAt` (-1)
- `following` + `createdAt` (-1)

**Validation:**
- `follower` ≠ `following` (kendi kendini takip edemez)

---

### Like Modeli

```typescript
interface ILike {
  _id: ObjectId;
  user: ObjectId;         // Beğenen kullanıcı
  post: ObjectId;         // Beğenilen gönderi
  createdAt: Date;
}
```

**Indexler:**
- `user` + `post` (unique compound)
- `post` + `createdAt` (-1)

---

### Comment Modeli

```typescript
interface IComment {
  _id: ObjectId;
  author: ObjectId;       // Yorum yapan kullanıcı
  post: ObjectId;         // Yorum yapılan gönderi
  content: string;        // Yorum içeriği
  parentComment?: ObjectId; // Yanıt verilen yorum (iç içe yorumlar)
  likeCount: number;      // Yoruma yapılan beğeni sayısı
  replyCount: number;     // Yanıt sayısı
  isDeleted: boolean;     // Soft delete
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexler:**
- `post` + `createdAt` (-1)
- `author` + `createdAt` (-1)
- `parentComment`

---

### Notification Modeli

```typescript
interface INotification {
  _id: ObjectId;
  recipient: ObjectId;    // Bildirimi alan kullanıcı
  sender: ObjectId;       // Bildirimi gönderen kullanıcı
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share';
  relatedPost?: ObjectId; // İlgili gönderi (varsa)
  message: string;        // Bildirim mesajı
  isRead: boolean;        // Okunma durumu
  createdAt: Date;
}
```

**Indexler:**
- `recipient` + `isRead` + `createdAt` (-1)
- `sender` + `createdAt` (-1)

## 🐘 PostgreSQL Şemaları

### users Tablosu

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    profile_picture TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexler
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

---

### posts Tablosu

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    post_id VARCHAR(50) UNIQUE NOT NULL,
    author_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (LENGTH(content) <= 2000),
    media JSONB,
    tags TEXT[],
    mentions TEXT[],
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexler
CREATE INDEX idx_posts_author_created ON posts(author_id, created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);
```

---

### follows Tablosu

```sql
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    following_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Indexler
CREATE INDEX idx_follows_follower ON follows(follower_id, created_at DESC);
CREATE INDEX idx_follows_following ON follows(following_id, created_at DESC);
```

---

### likes Tablosu

```sql
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(user_id) ON DELETE CASCADE,
    post_id VARCHAR(50) REFERENCES posts(post_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Indexler
CREATE INDEX idx_likes_post_created ON likes(post_id, created_at DESC);
CREATE INDEX idx_likes_user_created ON likes(user_id, created_at DESC);
```

## 📊 Redis Veri Yapıları

### Session Cache

```typescript
// Key: session:{userId}
interface SessionData {
  userId: string;
  username: string;
  email: string;
  lastActivity: string;
  deviceInfo?: string;
}

// TTL: 24 saat
```

---

### User Cache

```typescript
// Key: user:{userId}
interface CachedUser {
  userId: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
}

// TTL: 1 saat
```

---

### Post Cache

```typescript
// Key: post:{postId}
interface CachedPost {
  postId: string;
  content: string;
  author: {
    userId: string;
    username: string;
    fullName: string;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

// TTL: 30 dakika
```

---

### Rate Limiting

```typescript
// Key: rate_limit:{ip}:{endpoint}
// Value: İstek sayısı
// TTL: 15 dakika

// Key: rate_limit_auth:{ip}
// Value: Auth istek sayısı
// TTL: 15 dakika
```

---

### Feed Cache

```typescript
// Key: feed:{userId}
interface FeedCache {
  posts: string[];        // Post ID'leri
  lastUpdated: string;
  nextPageToken?: string;
}

// TTL: 10 dakika
```

## 🕸️ Neo4J Graf Şemaları

### User Node

```cypher
CREATE CONSTRAINT user_id_unique ON (u:User) ASSERT u.userId IS UNIQUE;

// User node özellikleri
(:User {
  userId: string,
  username: string,
  fullName: string,
  createdAt: datetime
})
```

---

### Follow İlişkisi

```cypher
// Takip ilişkisi
(follower:User)-[:FOLLOWS {createdAt: datetime}]->(following:User)

// Örnek sorgular:

// Kullanıcının takip ettikleri
MATCH (u:User {userId: $userId})-[:FOLLOWS]->(following:User)
RETURN following;

// Ortak takipler
MATCH (u1:User {userId: $userId1})-[:FOLLOWS]->(mutual:User)<-[:FOLLOWS]-(u2:User {userId: $userId2})
RETURN mutual;

// Takip önerileri (arkadaşın arkadaşları)
MATCH (u:User {userId: $userId})-[:FOLLOWS]->()-[:FOLLOWS]->(suggested:User)
WHERE NOT (u)-[:FOLLOWS]->(suggested) AND u <> suggested
RETURN suggested, count(*) as strength
ORDER BY strength DESC;
```

---

### Interest Node ve İlişkiler

```cypher
// İlgi alanları
(:Interest {
  name: string,
  category: string
})

// Kullanıcı ilgi alanları
(user:User)-[:INTERESTED_IN {strength: float}]->(interest:Interest)

// Gönderi ilgi alanları (tag'lerden türetilen)
(post:Post)-[:TAGGED_WITH]->(interest:Interest)
```

## 🔄 Veri Senkronizasyonu

### MongoDB → Redis Cache

```typescript
// Post oluşturulduğunda
async function cacheNewPost(post: IPost) {
  await redis.setex(
    `post:${post._id}`,
    1800, // 30 dakika
    JSON.stringify({
      postId: post._id,
      content: post.content,
      author: await getUserBasicInfo(post.author),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    })
  );
}

// Kullanıcı bilgileri güncellendiğinde
async function invalidateUserCache(userId: string) {
  await redis.del(`user:${userId}`);
  // İlgili feed cache'lerini de temizle
  await redis.del(`feed:${userId}`);
}
```

---

### MongoDB → Neo4J Sync

```typescript
// Yeni takip ilişkisi oluşturulduğında
async function syncFollowToNeo4j(follow: IFollow) {
  const session = neo4jDriver.session();
  try {
    await session.run(`
      MATCH (follower:User {userId: $followerId})
      MATCH (following:User {userId: $followingId})
      CREATE (follower)-[:FOLLOWS {createdAt: datetime($createdAt)}]->(following)
    `, {
      followerId: follow.follower.toString(),
      followingId: follow.following.toString(),
      createdAt: follow.createdAt.toISOString()
    });
  } finally {
    await session.close();
  }
}
```

## 🔍 Sık Kullanılan Sorgular

### MongoDB Aggregate Sorguları

```typescript
// Kullanıcının feed'ini getir
const userFeed = await Post.aggregate([
  {
    $match: {
      author: { $in: followingUserIds },
      isDeleted: false
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorData'
    }
  },
  {
    $sort: { createdAt: -1 }
  },
  {
    $skip: (page - 1) * limit
  },
  {
    $limit: limit
  }
]);

// Trend olan tag'leri getir
const trendingTags = await Post.aggregate([
  {
    $match: {
      createdAt: { $gte: oneDayAgo },
      isDeleted: false
    }
  },
  {
    $unwind: '$tags'
  },
  {
    $group: {
      _id: '$tags',
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 10
  }
]);
```

---

### Redis Lua Scripts

```lua
-- Rate limiting script
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call('GET', key)
if current == false then
  redis.call('SETEX', key, window, 1)
  return 1
else
  current = tonumber(current)
  if current < limit then
    redis.call('INCR', key)
    return current + 1
  else
    return -1
  end
end
```

## 📈 Performans Optimizasyonları

### Database Indexing Strategy

1. **MongoDB:**
   - Compound indexler sık kullanılan query patternleri için
   - Sparse indexler optional field'lar için
   - TTL indexler otomatik temizlik için

2. **PostgreSQL:**
   - BTREE indexler equality ve range sorguları için
   - GIN indexler JSONB ve array field'lar için
   - Partial indexler conditional sorgular için

3. **Redis:**
   - Memory optimization için hash kullanımı
   - Pipeline kullanarak multiple operations
   - Cluster setup büyük veri setleri için

### Caching Strategy

1. **Write-Through:** Kritik veriler için
2. **Write-Behind:** Yüksek throughput gereken durumlar için
3. **Cache-Aside:** Flexible caching için
4. **TTL Management:** Memory usage optimization

---

**Son Güncelleme:** 12 Ekim 2025
**Versiyon:** 1.0.0