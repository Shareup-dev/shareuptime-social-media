# ShareUpTime Backend API Dokümantasyonu

## 📚 İçindekiler

1. [Genel Bilgiler](#genel-bilgiler)
2. [Kimlik Doğrulama](#kimlik-doğrulama)
3. [Kullanıcı API'leri](#kullanıcı-apileri)
4. [Kimlik Doğrulama API'leri](#kimlik-doğrulama-apileri)
5. [Gönderi API'leri](#gönderi-apileri)
6. [Takip Sistemi API'leri](#takip-sistemi-apileri)
7. [Hata Yönetimi](#hata-yönetimi)
8. [Örnek Kullanım](#örnek-kullanım)

## 🌐 Genel Bilgiler

**Base URL:** `http://localhost:4000/api`
**Content-Type:** `application/json`
**Kimlik Doğrulama:** Bearer Token (JWT)

### Rate Limiting
- **Genel:** 100 istek/15 dakika
- **Auth Giriş:** 5 istek/15 dakika
- **Kayıt:** 3 istek/saat

## 🔐 Kimlik Doğrulama

Bearer token kullanarak kimlik doğrulama:

```javascript
headers: {
  'Authorization': 'Bearer ' + token,
  'Content-Type': 'application/json'
}
```

## 👤 Kullanıcı API'leri

### POST /api/users/register
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla oluşturuldu",
  "data": {
    "id": "<uuid>",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2025-10-12T10:30:00Z"
  }
}
```

**Hata Durumları:**
- `400` - Geçersiz veri
- `409` - Kullanıcı zaten mevcut

---

### GET /api/users/search?q=:query
Kullanıcı araması yapar.

**Query Parameters:**
- `q` (string, required): Arama terimi

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "<uuid>",
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "profile_picture_url": "https://example.com/avatar.jpg",
      "is_verified": false
    }
  ]
}
```

---

### GET /api/users/:userId
Kullanıcı profilini getirir.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Software Developer",
    "profile_picture_url": "https://example.com/avatar.jpg",
    "is_verified": false,
    "is_private": false,
    "location": null,
    "website": null,
    "created_at": "2025-10-12T10:30:00Z"
  }
}
```

---

### PUT /api/users/:userId 🔒
Kullanıcı profilini günceller.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Senior Software Developer",
  "profileImage": "https://example.com/new-avatar.jpg",
  "isPrivate": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "bio": "Senior Software Developer",
    "profile_picture_url": "https://example.com/new-avatar.jpg",
    "is_private": false,
    "updated_at": "2025-10-12T11:00:00Z"
  }
}
```

## 🔑 Kimlik Doğrulama API'leri

### POST /api/auth/login
Kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture_url": null,
    "is_verified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Hata Durumları:**
- `401` - Geçersiz kimlik bilgileri

---

### GET /api/auth/verify 🔒
Token doğrulaması yapar.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "bio": null,
    "profile_picture_url": null,
    "is_verified": false,
    "created_at": "2025-10-12T10:30:00Z"
  }
}
```

---

### POST /api/auth/change-password 🔒
Kullanıcı şifresini değiştirir.

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifre başarıyla değiştirildi"
}
```

---

### POST /api/auth/request-password-reset
Şifre sıfırlama talebi oluşturur.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Şifre sıfırlama e-postası gönderildi"
}
```

## 📝 Gönderi API'leri

### POST /api/posts 🔒
Yeni gönderi oluşturur.

**Request Body:**
```json
{
  "content": "Bu benim ilk gönderim!",
  "content": "Bu benim ilk gönderim!",
  "privacy": "public",
  "feeling": "happy",
  "location": "İstanbul"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "user_id": "<uuid>",
    "content": "Bu benim ilk gönderim!",
    "media_urls": [],
    "media_types": [],
    "privacy_level": "public",
    "location": "İstanbul",
    "feeling": "happy",
    "created_at": "2025-10-12T10:30:00Z",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture_url": null,
    "is_verified": false
  }
}
```

---

### GET /api/posts
Gönderileri listeler (sayfalama ile).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20, max: 50)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "<uuid>",
      "user_id": "<uuid>",
      "content": "...",
      "media_urls": [],
      "media_types": [],
      "privacy_level": "public",
      "created_at": "...",
      "username": "...",
      "first_name": "...",
      "last_name": "...",
      "profile_picture_url": null,
      "is_verified": false
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```

---

### GET /api/posts/:postId
Belirli bir gönderiyi getirir.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "user_id": "<uuid>",
    "content": "...",
    "media_urls": [],
    "media_types": [],
    "privacy_level": "public",
    "created_at": "...",
    "updated_at": "...",
    "username": "...",
    "first_name": "...",
    "last_name": "...",
    "profile_picture_url": null,
    "is_verified": false
  }
}
```

---

### GET /api/posts/user/:userId
Belirli bir kullanıcının gönderilerini getirir.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:** Genel gönderi listesi ile aynı format

---

### PUT /api/posts/:postId 🔒
Gönderiyi günceller (sadece gönderi sahibi).

**Request Body:**
```json
{
  "content": "Güncellenmiş içerik",
  "content": "Güncellenmiş içerik",
  "privacy": "friends",
  "feeling": "excited",
  "location": "Ankara",
  "mediaUrls": ["https://cdn/.../a.jpg"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "<uuid>",
    "content": "Güncellenmiş içerik",
    "privacy_level": "friends",
    "feeling": "excited",
    "location": "Ankara",
    "media_urls": ["https://cdn/.../a.jpg"],
    "updated_at": "2025-10-12T11:00:00Z"
  }
}
```

---

### DELETE /api/posts/:postId 🔒
Gönderiyi siler (sadece gönderi sahibi).

**Response (200):**
```json
{
  "success": true,
  "message": "Gönderi başarıyla silindi"
}
```

## 👥 Takip Sistemi API'leri

### POST /api/follows/:userId 🔒
Kullanıcıyı takip eder.

**Response (201):**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla takip edildi",
  "data": {
    "followerId": "<uuid>",
    "followingId": "<uuid>",
    "createdAt": "2025-10-12T10:30:00Z"
  }
}
```

**Hata Durumları:**
- `409` - Zaten takip ediliyor
- `400` - Kendini takip edemez

---

### DELETE /api/follows/:userId 🔒
Kullanıcıyı takipten çıkarır.

**Response (200):**
```json
{
  "success": true,
  "message": "Takipten başarıyla çıkarıldı"
}
```

---

### GET /api/follows/:userId/followers
Kullanıcının takipçilerini listeler.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "followers": [
      {
        "userId": "user789",
        "username": "janedoe",
        "fullName": "Jane Doe",
        "profilePicture": "https://example.com/jane.jpg",
        "followedAt": "2025-10-12T09:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalFollowers": 150
    }
  }
}
```

---

### GET /api/follows/:userId/following
Kullanıcının takip ettiklerini listeler.

**Response:** Takipçiler ile aynı format

---

### GET /api/follows/:userId/status 🔒
Takip durumunu kontrol eder.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "isFollowing": true,
    "isFollowedBy": false,
    "isMutual": false,
    "followedAt": "2025-10-12T09:00:00Z"
  }
}
```

---

### GET /api/follows/:userId/mutual 🔒
Ortak takipleri getirir.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "mutualFollowers": [
      {
        "userId": "user999",
        "username": "mutualfriend",
        "fullName": "Mutual Friend",
        "profilePicture": "https://example.com/mutual.jpg"
      }
    ],
    "count": 5
  }
}
```

## ⚠️ Hata Yönetimi

### Hata Response Formatı
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Geçersiz veri",
    "details": [
      {
        "field": "email",
        "message": "Geçerli bir e-posta adresi giriniz"
      }
    ]
  }
}
```

### Yaygın Hata Kodları
- `VALIDATION_ERROR` - Veri doğrulama hatası
- `AUTHENTICATION_REQUIRED` - Kimlik doğrulama gerekli
- `UNAUTHORIZED` - Yetkisiz işlem
- `NOT_FOUND` - Kaynak bulunamadı
- `DUPLICATE_ENTRY` - Duplicate kayıt
- `RATE_LIMIT_EXCEEDED` - Rate limit aşıldı
- `INTERNAL_ERROR` - Sunucu hatası

## 🔧 Örnek Kullanım

### JavaScript (Fetch API)
```javascript
// Kullanıcı Kaydı
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:4000/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  const result = await response.json();
  if (result.success) {
    // Token'ı localStorage'a kaydet
    localStorage.setItem('authToken', result.token);
    return result.data;
  }
  throw new Error(result.error.message);
};

// Giriş Yapma
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const result = await response.json();
  if (result.success) {
    localStorage.setItem('authToken', result.token);
    return result.data;
  }
  throw new Error(result.error.message);
};

// Gönderi Oluşturma
const createPost = async (postData) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:4000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
};

// Gönderileri Getirme
const getPosts = async (page = 1, limit = 10) => {
  const response = await fetch(
    `http://localhost:4000/api/posts?page=${page}&limit=${limit}`
  );
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
};

// Kullanıcı Takip Etme
const followUser = async (userId) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:4000/api/follows/${userId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
};
```

### React Hook Örneği
```javascript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token)
        .then(userData => setUser(userData))
        .catch(() => localStorage.removeItem('authToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return { user, loading, login, logout };
};

const verifyToken = async (token) => {
  const response = await fetch('http://localhost:4000/api/auth/verify', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error.message);
};
```

## 📞 Destek

Herhangi bir sorun veya soru için:
- GitHub Issues: [Shareup-dev/shareuptime-social-media](https://github.com/Shareup-dev/shareuptime-social-media/issues)
- Email: [Buraya email eklenebilir]

---

**Son Güncelleme:** 16 Ekim 2025
**API Versiyonu:** 1.0.0