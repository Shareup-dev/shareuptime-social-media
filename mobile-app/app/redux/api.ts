import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for authentication state
interface LoggedInUserState {
  payload?: {
    token?: string;
    user?: any;
  };
  token?: string;
  access_token?: string;
  user?: any;
  id?: string;
  email?: string;
  username?: string;
}

interface RootState {
  loggedInUser: LoggedInUserState;
  [key: string]: any;
}

// ShareUpTime Backend API base URL
import { API_BASE_URL } from '@/config/env';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const loggedInUser = state.loggedInUser;

    // Handle different token structures
    const token = loggedInUser?.payload?.token || loggedInUser?.token || loggedInUser?.access_token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// API slice with RTK Query
export const shareUpTimeApi = createApi({
  reducerPath: 'shareUpTimeApi',
  baseQuery,
  tagTypes: ['User', 'Post', 'Comment', 'Follow', 'Message', 'Conversation'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<{ user: any; token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<
      { user: any; token: string },
      {
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
      }
    >({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // User endpoints
    getProfile: builder.query<any, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<any, { userId: string; updates: any }>({
      query: ({ userId, updates }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),

    // Posts endpoints
    getFeedPosts: builder.query<any[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/posts?page=${page}&limit=${limit}`,
      providesTags: ['Post'],
    }),

    createPost: builder.mutation<any, FormData>({
      query: (postData) => ({
        url: '/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),

    likePost: builder.mutation<any, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),

    // Follow endpoints
    followUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/follows/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Follow'],
    }),

    unfollowUser: builder.mutation<any, string>({
      query: (userId) => ({
        url: `/follows/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Follow'],
    }),

    // Comments endpoints
    getPostComments: builder.query<any[], string>({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: ['Comment'],
    }),

    createComment: builder.mutation<
      any,
      {
        postId: string;
        content: string;
        parentId?: string;
      }
    >({
      query: ({ postId, content, parentId }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: { content, parentId },
      }),
      invalidatesTags: ['Comment', 'Post'],
    }),

    // Messages endpoints (for future implementation)
    getConversations: builder.query<any[], void>({
      query: () => '/messages/conversations',
      providesTags: ['Conversation'],
    }),

    getMessages: builder.query<any[], { conversationId: string; page?: number }>({
      query: ({ conversationId, page = 1 }) =>
        `/messages/conversations/${conversationId}/messages?page=${page}`,
      providesTags: ['Message'],
    }),

    sendMessage: builder.mutation<
      any,
      {
        conversationId: string;
        content: string;
        type?: 'text' | 'media';
      }
    >({
      query: ({ conversationId, ...messageData }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['Message', 'Conversation'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetFeedPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetPostCommentsQuery,
  useCreateCommentMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = shareUpTimeApi;

export default shareUpTimeApi;
