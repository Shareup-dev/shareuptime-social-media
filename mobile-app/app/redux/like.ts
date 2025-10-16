import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LikeState {
  likedPosts: Record<string, boolean>;
  likeCount: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

const initialState: LikeState = {
  likedPosts: {},
  likeCount: {},
  isLoading: false,
  error: null,
};

const likeSlice = createSlice({
  name: 'like',
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
    likePost: (state, action: PayloadAction<{ postId: string; likeCount: number }>) => {
      const { postId, likeCount } = action.payload;
      state.likedPosts[postId] = true;
      state.likeCount[postId] = likeCount;
      state.isLoading = false;
      state.error = null;
    },
    unlikePost: (state, action: PayloadAction<{ postId: string; likeCount: number }>) => {
      const { postId, likeCount } = action.payload;
      state.likedPosts[postId] = false;
      state.likeCount[postId] = likeCount;
      state.isLoading = false;
      state.error = null;
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const isCurrentlyLiked = state.likedPosts[postId] || false;
      const currentCount = state.likeCount[postId] || 0;

      state.likedPosts[postId] = !isCurrentlyLiked;
      state.likeCount[postId] = isCurrentlyLiked ? currentCount - 1 : currentCount + 1;
    },
    setPostLikeStatus: (
      state,
      action: PayloadAction<{
        postId: string;
        isLiked: boolean;
        likeCount: number;
      }>,
    ) => {
      const { postId, isLiked, likeCount } = action.payload;
      state.likedPosts[postId] = isLiked;
      state.likeCount[postId] = likeCount;
    },
    bulkSetLikeStatus: (
      state,
      action: PayloadAction<
        Array<{
          postId: string;
          isLiked: boolean;
          likeCount: number;
        }>
      >,
    ) => {
      action.payload.forEach(({ postId, isLiked, likeCount }) => {
        state.likedPosts[postId] = isLiked;
        state.likeCount[postId] = likeCount;
      });
    },
    clearLikes: (state) => {
      state.likedPosts = {};
      state.likeCount = {};
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  likePost,
  unlikePost,
  toggleLike,
  setPostLikeStatus,
  bulkSetLikeStatus,
  clearLikes,
} = likeSlice.actions;

export default likeSlice.reducer;
