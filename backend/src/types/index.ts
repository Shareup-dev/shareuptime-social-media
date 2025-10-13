// Kullanıcı tipleri
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  bio?: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
  isPrivate?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Gönderi tipleri
export interface Post {
  id: string;
  authorId: string;
  content: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  content: string;
  mediaUrls?: string[];
}

// Takip tipleri
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// API Response tipleri
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}