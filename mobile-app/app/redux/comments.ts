import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommentUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
}

interface Comment {
  id: string;
  postId: string;
  user: CommentUser;
  content: string;
  likeCount: number;
  replyCount: number;
  isLiked: boolean;
  parentId?: string; // For nested replies
  createdAt: string;
  updatedAt: string;
}

interface CommentsState {
  commentsByPost: Record<string, Comment[]>;
  isLoading: boolean;
  loadingPostIds: string[];
  error: string | null;
}

const initialState: CommentsState = {
  commentsByPost: {},
  isLoading: false,
  loadingPostIds: [],
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ postId?: string; isLoading: boolean }>) => {
      const { postId, isLoading } = action.payload;
      
      if (postId) {
        if (isLoading && !state.loadingPostIds.includes(postId)) {
          state.loadingPostIds.push(postId);
        } else if (!isLoading) {
          state.loadingPostIds = state.loadingPostIds.filter(id => id !== postId);
        }
      } else {
        state.isLoading = isLoading;
      }
      
      if (isLoading) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.loadingPostIds = [];
    },
    setComments: (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
      const { postId, comments } = action.payload;
      state.commentsByPost[postId] = comments;
      state.loadingPostIds = state.loadingPostIds.filter(id => id !== postId);
      state.error = null;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const comment = action.payload;
      const postId = comment.postId;
      
      if (!state.commentsByPost[postId]) {
        state.commentsByPost[postId] = [];
      }
      
      // Add to beginning for chronological order
      state.commentsByPost[postId].unshift(comment);
    },
    updateComment: (state, action: PayloadAction<{ 
      postId: string; 
      commentId: string; 
      updates: Partial<Comment> 
    }>) => {
      const { postId, commentId, updates } = action.payload;
      const comments = state.commentsByPost[postId];
      
      if (comments) {
        const commentIndex = comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
          comments[commentIndex] = { ...comments[commentIndex], ...updates };
        }
      }
    },
    removeComment: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const { postId, commentId } = action.payload;
      const comments = state.commentsByPost[postId];
      
      if (comments) {
        state.commentsByPost[postId] = comments.filter(comment => comment.id !== commentId);
      }
    },
    toggleCommentLike: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const { postId, commentId } = action.payload;
      const comments = state.commentsByPost[postId];
      
      if (comments) {
        const comment = comments.find(comment => comment.id === commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likeCount += comment.isLiked ? 1 : -1;
        }
      }
    },
    incrementReplyCount: (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
      const { postId, commentId } = action.payload;
      const comments = state.commentsByPost[postId];
      
      if (comments) {
        const comment = comments.find(comment => comment.id === commentId);
        if (comment) {
          comment.replyCount += 1;
        }
      }
    },
    clearPostComments: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      delete state.commentsByPost[postId];
      state.loadingPostIds = state.loadingPostIds.filter(id => id !== postId);
    },
    clearAllComments: (state) => {
      state.commentsByPost = {};
      state.loadingPostIds = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setComments,
  addComment,
  updateComment,
  removeComment,
  toggleCommentLike,
  incrementReplyCount,
  clearPostComments,
  clearAllComments,
} = commentsSlice.actions;

export default commentsSlice.reducer;