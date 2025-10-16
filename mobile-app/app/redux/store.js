import { configureStore } from '@reduxjs/toolkit';

import likeReducer from './like';
import sentRequests from './sentRequests';
import loggedInUserSlice from './loggedInUser';
import commentsReducer from './comments';
import registrationSlice from './accountRegistration';
import groupPostsReducer from './groupPosts';
import userGroupsReducer from './userGroups';
import swapedImages from './swapedImages';
import imagesPickerReducer from './imagesPickerSlice';
import stories from './stories';
import reelScreenDetector from './reelScreenDetector';
import feedPostsReducer from './feedPostsSlice';
import messagesReducer from './messagesSlice';
import ConversationsSlice from './ConversationsSlice';
import postFeelings from './postFeelings';

const store = configureStore({
  reducer: {
    like: likeReducer,
    comments: commentsReducer,
    loggedInUserSlice: loggedInUserSlice.reducer,
    sentRequests,
    registationSlice: registrationSlice.reducer,
    groupPosts: groupPostsReducer,
    userGroups: userGroupsReducer,
    swapedImages: swapedImages.reducer,
    imagesPicker: imagesPickerReducer,
    stories: stories.reducer,
    reelScreenDetector: reelScreenDetector.reducer,
    feedPosts: feedPostsReducer,
    messages: messagesReducer,
    ConversationsSlice,
    postFeelings,
  },
});

export default store;
