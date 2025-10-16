import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoryMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number; // For videos
}

interface StoryUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
}

interface Story {
  id: string;
  user: StoryUser;
  media: StoryMedia;
  viewCount: number;
  isViewed: boolean;
  createdAt: string;
  expiresAt: string;
}

interface UserStories {
  user: StoryUser;
  stories: Story[];
  hasUnviewed: boolean;
}

interface StoriesState {
  userStories: UserStories[];
  currentStoryIndex: number;
  currentUserIndex: number;
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
}

const initialState: StoriesState = {
  userStories: [],
  currentStoryIndex: 0,
  currentUserIndex: 0,
  isLoading: false,
  isUploading: false,
  error: null,
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isUploading = false;
    },
    setStories: (state, action: PayloadAction<UserStories[]>) => {
      state.userStories = action.payload;
      state.currentStoryIndex = 0;
      state.currentUserIndex = 0;
      state.isLoading = false;
      state.error = null;
    },
    addUserStories: (state, action: PayloadAction<UserStories>) => {
      const newUserStories = action.payload;
      const existingIndex = state.userStories.findIndex(
        (us) => us.user.id === newUserStories.user.id,
      );

      if (existingIndex !== -1) {
        state.userStories[existingIndex] = newUserStories;
      } else {
        state.userStories.unshift(newUserStories);
      }
    },
    addStory: (state, action: PayloadAction<Story>) => {
      const newStory = action.payload;
      const userStoriesIndex = state.userStories.findIndex((us) => us.user.id === newStory.user.id);

      if (userStoriesIndex !== -1) {
        state.userStories[userStoriesIndex].stories.unshift(newStory);
        state.userStories[userStoriesIndex].hasUnviewed = true;
      } else {
        state.userStories.unshift({
          user: newStory.user,
          stories: [newStory],
          hasUnviewed: true,
        });
      }
      state.isUploading = false;
    },
    markStoryAsViewed: (state, action: PayloadAction<{ userId: string; storyId: string }>) => {
      const { userId, storyId } = action.payload;
      const userStoriesIndex = state.userStories.findIndex((us) => us.user.id === userId);

      if (userStoriesIndex !== -1) {
        const storyIndex = state.userStories[userStoriesIndex].stories.findIndex(
          (s) => s.id === storyId,
        );

        if (storyIndex !== -1) {
          state.userStories[userStoriesIndex].stories[storyIndex].isViewed = true;
          state.userStories[userStoriesIndex].stories[storyIndex].viewCount += 1;

          // Check if all stories are viewed
          const hasUnviewed = state.userStories[userStoriesIndex].stories.some((s) => !s.isViewed);
          state.userStories[userStoriesIndex].hasUnviewed = hasUnviewed;
        }
      }
    },
    setCurrentStoryIndex: (state, action: PayloadAction<number>) => {
      state.currentStoryIndex = action.payload;
    },
    setCurrentUserIndex: (state, action: PayloadAction<number>) => {
      state.currentUserIndex = action.payload;
      state.currentStoryIndex = 0;
    },
    nextStory: (state) => {
      const currentUserStories = state.userStories[state.currentUserIndex];
      if (currentUserStories && state.currentStoryIndex < currentUserStories.stories.length - 1) {
        state.currentStoryIndex += 1;
      } else if (state.currentUserIndex < state.userStories.length - 1) {
        state.currentUserIndex += 1;
        state.currentStoryIndex = 0;
      }
    },
    previousStory: (state) => {
      if (state.currentStoryIndex > 0) {
        state.currentStoryIndex -= 1;
      } else if (state.currentUserIndex > 0) {
        state.currentUserIndex -= 1;
        const prevUserStories = state.userStories[state.currentUserIndex];
        state.currentStoryIndex = prevUserStories.stories.length - 1;
      }
    },
    removeExpiredStories: (state) => {
      const now = new Date().toISOString();
      state.userStories = state.userStories
        .map((userStories) => ({
          ...userStories,
          stories: userStories.stories.filter((story) => story.expiresAt > now),
        }))
        .filter((userStories) => userStories.stories.length > 0);

      // Reset indices if needed
      if (state.currentUserIndex >= state.userStories.length) {
        state.currentUserIndex = 0;
        state.currentStoryIndex = 0;
      }
    },
    clearStories: (state) => {
      state.userStories = [];
      state.currentStoryIndex = 0;
      state.currentUserIndex = 0;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setUploading,
  setError,
  setStories,
  addUserStories,
  addStory,
  markStoryAsViewed,
  setCurrentStoryIndex,
  setCurrentUserIndex,
  nextStory,
  previousStory,
  removeExpiredStories,
  clearStories,
} = storiesSlice.actions;

export default storiesSlice.reducer;
