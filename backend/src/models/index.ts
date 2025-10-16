import mongoose, { Schema, Document } from 'mongoose';

// Kullanıcı Mongoose Document interface
interface UserDocument extends Document {
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

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: 160,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Kullanıcı modeli
export const UserModel = mongoose.model<UserDocument>('User', userSchema);

// Gönderi Mongoose Document interface
interface PostDocument extends Document {
  authorId: string;
  content: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<PostDocument>(
  {
    authorId: {
      type: String,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
      maxlength: 2200,
    },
    mediaUrls: [
      {
        type: String,
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Gönderi modeli
export const PostModel = mongoose.model<PostDocument>('Post', postSchema);

// Takip Mongoose Document interface
interface FollowDocument extends Document {
  followerId: string;
  followingId: string;
  createdAt: Date;
}

const followSchema = new Schema<FollowDocument>(
  {
    followerId: {
      type: String,
      required: true,
      ref: 'User',
    },
    followingId: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Benzersizlik: bir kullanıcı başka bir kullanıcıyı sadece bir kez takip edebilir
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Takip modeli
export const FollowModel = mongoose.model<FollowDocument>('Follow', followSchema);
