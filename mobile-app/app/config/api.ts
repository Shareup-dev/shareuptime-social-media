interface ApiConfig {
  baseUrl: string;
  timeout: number;
  endpoints: {
    auth: {
      login: string;
      register: string;
      logout: string;
      refresh: string;
      verify: string;
      changePassword: string;
      requestPasswordReset: string;
    };
    users: {
      profile: string;
      updateProfile: string;
      followers: string;
      following: string;
      search: string;
      register: string;
    };
    posts: {
      feed: string;
      create: string;
      like: string;
      comments: string;
      byUser: string;
      byId: string;
      update: string;
      delete: string;
    };
    follows: {
      follow: string;
      unfollow: string;
      followers: string;
      following: string;
      status: string;
      mutual: string;
    };
    messages: {
      conversations: string;
      send: string;
    };
  };
}

const apiConfig: ApiConfig = {
  baseUrl: 'http://localhost:4000/api',
  timeout: 30000,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/users/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      verify: '/auth/verify',
      changePassword: '/auth/change-password',
      requestPasswordReset: '/auth/request-password-reset',
    },
    users: {
      profile: '/users/:id',
      updateProfile: '/users/:id',
      followers: '/follows/:id/followers',
      following: '/follows/:id/following',
      search: '/users/search',
      register: '/users/register',
    },
    posts: {
      feed: '/posts',
      create: '/posts',
      like: '/posts/:id/like',
      comments: '/posts/:id/comments',
      byUser: '/posts/user/:userId',
      byId: '/posts/:postId',
      update: '/posts/:postId',
      delete: '/posts/:postId',
    },
    follows: {
      follow: '/follows/:userId',
      unfollow: '/follows/:userId',
      followers: '/follows/:userId/followers',
      following: '/follows/:userId/following',
      status: '/follows/:userId/status',
      mutual: '/follows/:userId/mutual',
    },
    messages: {
      conversations: '/messages/conversations',
      send: '/messages/conversations/:id',
    },
  },
};

export { apiConfig };
export default apiConfig;