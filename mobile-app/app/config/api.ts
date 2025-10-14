interface ApiConfig {
  baseUrl: string;
  timeout: number;
  endpoints: {
    auth: {
      login: string;
      register: string;
      logout: string;
      refresh: string;
    };
    users: {
      profile: string;
      updateProfile: string;
      followers: string;
      following: string;
    };
    posts: {
      feed: string;
      create: string;
      like: string;
      comments: string;
    };
    messages: {
      conversations: string;
      send: string;
    };
  };
}

const apiConfig: ApiConfig = {
  baseUrl: 'http://localhost:8000/api',
  timeout: 30000,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
    },
    users: {
      profile: '/users',
      updateProfile: '/users',
      followers: '/users/:id/followers',
      following: '/users/:id/following',
    },
    posts: {
      feed: '/posts/feed',
      create: '/posts',
      like: '/posts/:id/like',
      comments: '/posts/:id/comments',
    },
    messages: {
      conversations: '/messages/conversations',
      send: '/messages/conversations/:id',
    },
  },
};

export default apiConfig;