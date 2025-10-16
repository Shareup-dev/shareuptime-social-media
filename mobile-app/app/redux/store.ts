import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import type { Action, ThunkAction } from '@reduxjs/toolkit';

// Import RTK Query API
import { shareUpTimeApi } from './api';

// Import reducers (TypeScript ones)
import loggedInUserSlice from './loggedInUser';
import feedPostsReducer from './feedPostsSlice';
import messagesReducer from './messagesSlice';

// Import modernized TypeScript slices
import likeReducer from './like';
import commentsReducer from './comments';
import storiesReducer from './stories';

// Import legacy reducers (JavaScript ones - to be migrated)
import sentRequestsReducer from './sentRequests';
import registrationSlice from './accountRegistration';
import groupPostsReducer from './groupPosts';
import userGroupsReducer from './userGroups';
import swapedImagesSlice from './swapedImages';
import imagesPickerReducer from './imagesPickerSlice';
import reelScreenDetectorSlice from './reelScreenDetector';
import conversationsReducer from './ConversationsSlice';
import postFeelingsReducer from './postFeelings';

// Root reducer
const rootReducer = combineReducers({
  // RTK Query API
  [shareUpTimeApi.reducerPath]: shareUpTimeApi.reducer,

  // Modern TypeScript slices
  loggedInUser: loggedInUserSlice.reducer,
  feedPosts: feedPostsReducer,
  messages: messagesReducer,
  like: likeReducer,
  comments: commentsReducer,
  stories: storiesReducer,

  // Legacy slices (to be migrated)
  sentRequests: sentRequestsReducer,
  registration: registrationSlice.reducer,
  groupPosts: groupPostsReducer,
  userGroups: userGroupsReducer,
  swapedImages: swapedImagesSlice.reducer,
  imagesPicker: imagesPickerReducer,
  reelScreenDetector: reelScreenDetectorSlice.reducer,
  conversations: conversationsReducer,
  postFeelings: postFeelingsReducer,
});

// Store setup with middleware
export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/FLUSH',
            'persist/REHYDRATE',
            'persist/PAUSE',
            'persist/PERSIST',
            'persist/PURGE',
            'persist/REGISTER',
          ],
        },
      }).concat(shareUpTimeApi.middleware),
    preloadedState,
    devTools: __DEV__,
  });
};

export const store = setupStore();

// Types
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
