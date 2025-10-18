# ShareUpTime Backend - Veri Modelleri ve Şemalar

## 📊 Veritabanı Şemaları

Bu belge, ShareUpTime backend projesinde kullanılan veri modellerini ve
veritabanı şemalarını özetler.

- Birincil veritabanı: PostgreSQL (UUID birincil anahtarlar)
- Alternatif (opsiyonel): MongoDB (PostgreSQL kullanılamazsa dev/fallback)
- Cache: Redis (geliştirmede devre dışı)
- Graf: Neo4J (opsiyonel entegrasyon notları)

Kaynak şema dosyaları:
- `src/config/shareuptime_schema.sql` (Güncel ve kapsamlı)
- `src/config/schema.sql` (Daha minimal/örnek şema)
- `src/config/performance_indexes.sql` (Performans odaklı ek indeksler ve
  yardımcı görünümler)

Not: Aşağıdaki PostgreSQL şeması, kod ve `shareuptime_schema.sql` ile bire bir uyumludur.

## 🐘 PostgreSQL Şemaları (Canonical)

Ön koşul: UUID oluşturmak için uzantı etkinleştirilir.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### users Tablosu

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  bio TEXT,
  profile_picture_url VARCHAR(500),
  cover_photo_url VARCHAR(500),
  is_verified BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  date_of_birth DATE,
  location VARCHAR(200),
  website VARCHAR(300),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

### posts Tablosu

```sql
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],                -- Medya URL dizisi
  media_types VARCHAR(20)[],        -- Medya türleri (image, video, ...)
  privacy_level VARCHAR(20) DEFAULT 'public'
    CHECK (
      privacy_level IN ('public', 'friends', 'private')
    ),
  location VARCHAR(200),
  feeling VARCHAR(100),
  activity VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,   -- Soft delete için
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
```

### comments Tablosu

```sql
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url VARCHAR(500),
  likes_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
```

### likes Tablosu (genel beğeniler)

```sql
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL, -- post veya comment kimliği
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, target_id, target_type)
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_likes_target ON likes(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
```

### follows Tablosu

```sql
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'accepted'
    CHECK (
      status IN ('pending', 'accepted', 'blocked')
    ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
```

### stories ve story_views Tabloları

```sql
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_url VARCHAR(500) NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  content TEXT,
  duration INTEGER DEFAULT 24, -- saat
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(story_id, viewer_id)
);
```

### Mesajlaşma: conversations, conversation_participants, messages

```sql
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name VARCHAR(200),
  description TEXT,
  creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  media_url VARCHAR(500),
  media_type VARCHAR(20),
  message_type VARCHAR(20) DEFAULT 'text'
    CHECK (
      message_type IN ('text', 'image', 'video', 'file', 'location')
    ),
  reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Gruplar: groups ve group_members

```sql
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  profile_picture_url VARCHAR(500),
  cover_photo_url VARCHAR(500),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  privacy_level VARCHAR(20) DEFAULT 'public'
    CHECK (
      privacy_level IN ('public', 'private', 'secret')
    ),
  is_active BOOLEAN DEFAULT TRUE,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  status VARCHAR(20) DEFAULT 'accepted'
    CHECK (
      status IN ('pending', 'accepted', 'blocked')
    ),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id)
);
```

### notifications Tablosu

```sql
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indeksler
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
```

### updated_at Triggerları

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## 📈 Performans İndeksleri (Ek)

Ek performans indeksleri ve görünümler için `src/config/performance_indexes.sql`
dosyasına bakın. Bu dosya, sık kullanılan sorgular için GIN/BTREE indeksler ve
bazı yardımcı görünümler içerir. Uygulama koduyla uyum için sütun adlarının
güncel şema ile eşleştiğinden emin olun (ör. `posts.is_active` ve
`notifications.user_id`).

## 🗃️ MongoDB (Opsiyonel/Fallback)

PostgreSQL bağlantısı sağlanamadığında, `.env` içinde `MONGO_URI`
tanımlıysa MongoDB bağlantısı denenir. Aşağıdaki örnek arayüzler konsept
amaçlıdır ve canlı şemanın yerine geçmez.

```typescript
interface IUser {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📊 Redis Veri Yapıları (Cache)

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

## 🕸️ Neo4J Graf Şemaları (Opsiyonel)

### User Node

```cypher
CREATE CONSTRAINT user_id_unique IF NOT EXISTS ON (u:User) ASSERT u.userId IS UNIQUE;

// User node özellikleri
// (:User { userId, username, fullName, createdAt })
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
MATCH (u1:User {userId: $userId1})-[:FOLLOWS]->(mutual:User)
  <-[:FOLLOWS]-(u2:User {userId: $userId2})
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
// İlgi alanları, kullanıcı ve gönderi etiketleme örneği
// (:Interest { name, category })
(user:User)-[:INTERESTED_IN {strength: 0.0}]->(interest:Interest)
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

**Son Güncelleme:** 16 Ekim 2025
**Versiyon:** 1.0.0