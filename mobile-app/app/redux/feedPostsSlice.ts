import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Post interface
interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
}

interface PostUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
}

interface Post {
  id: string;
  user: PostUser;
  content: string;
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  location?: string;
  feeling?: string;
  tags: string[];
}

interface FeedPostsState {
  posts: Post[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

const initialState: FeedPostsState = {
  posts: [],
  isLoading: false,
  hasMore: true,
  error: null,
};

const feedPostsSlice = createSlice({
  name: 'feedPosts',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setFeedPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addFeedPosts: (state, action: PayloadAction<Post[]>) => {
      const newPosts = action.payload.filter(
        (newPost) => !state.posts.some((existingPost) => existingPost.id === newPost.id),
      );
      state.posts.push(...newPosts);
      state.isLoading = false;
    },
    addFeedPost: (state, action: PayloadAction<Post>) => {
      const existingIndex = state.posts.findIndex((post) => post.id === action.payload.id);
      if (existingIndex === -1) {
        state.posts.unshift(action.payload);
      } else {
        state.posts[existingIndex] = action.payload;
      }
    },
    updatePost: (state, action: PayloadAction<{ id: string; updates: Partial<Post> }>) => {
      const { id, updates } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === id);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likeCount += post.isLiked ? 1 : -1;
      }
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
      }
    },
    incrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.commentCount += 1;
      }
    },
    decrementCommentCount: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.commentCount = Math.max(0, post.commentCount - 1);
      }
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearFeedPosts: (state) => {
      state.posts = [];
      state.hasMore = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setFeedPosts,
  addFeedPosts,
  addFeedPost,
  updatePost,
  removePost,
  toggleLike,
  toggleBookmark,
  incrementCommentCount,
  decrementCommentCount,
  setHasMore,
  clearFeedPosts,
} = feedPostsSlice.actions;

export default feedPostsSlice.reducer;
