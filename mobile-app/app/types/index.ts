// Core API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  userId: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  profilePicture?: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  bio?: string;
  profilePicture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse extends ApiResponse<User> {
  token: string;
}

// Post Types
export interface Post {
  postId: string;
  content: string;
  author: {
    userId: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  media?: MediaItem[];
  tags?: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
}

export interface CreatePostRequest {
  content: string;
  media?: MediaItem[];
  tags?: string[];
}

// Follow Types
export interface Follow {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface FollowStatus {
  isFollowing: boolean;
  isFollowedBy: boolean;
  isMutual: boolean;
  followedAt?: string;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  SignUpStep2: { userData: Partial<CreateUserRequest> };
  ForgotPassword: undefined;
  PasswordResetOTP: { email: string };
  PasswordReset: { email: string; otp: string };
  SignupVerification: { email: string };
  NewsFeed: undefined;
  AddPost: undefined;
  Account: undefined;
  UserProfile: { userId: string };
  EditProfile: undefined;
  Messages: undefined;
  ChatRoom: { userId: string; userName: string };
  Groups: undefined;
  Comments: { postId: string };
  AllFriends: { userId: string };
};

// Redux State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    hasMore: boolean;
  };
}

export interface RootState {
  auth: AuthState;
  posts: PostState;
}
