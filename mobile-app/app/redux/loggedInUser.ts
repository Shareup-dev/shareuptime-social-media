import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// User interface
interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

interface LoggedInUserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: LoggedInUserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserStats: (state, action: PayloadAction<{
      followerCount?: number;
      followingCount?: number;
      postCount?: number;
    }>) => {
      if (state.user) {
        if (action.payload.followerCount !== undefined) {
          state.user.followerCount = action.payload.followerCount;
        }
        if (action.payload.followingCount !== undefined) {
          state.user.followingCount = action.payload.followingCount;
        }
        if (action.payload.postCount !== undefined) {
          state.user.postCount = action.payload.postCount;
        }
      }
    },
  },
});

export const {
  setUser,
  logOut,
  setLoading,
  updateUserProfile,
  updateUserStats,
} = loggedInUserSlice.actions;

export default loggedInUserSlice;