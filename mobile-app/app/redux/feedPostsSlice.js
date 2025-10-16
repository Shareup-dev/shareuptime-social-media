import { createSlice } from '@reduxjs/toolkit';

const feedPostsSlice = createSlice({
  name: 'feedPosts',
  initialState: [],
  reducers: {
    setFeedPosts: (previousState, newFeedPost) => {
      return (previousState = newFeedPost.payload);
    },
    addFeedPost: (previousFeedPosts, newFeedPost) => {
      let allFeedPosts = [newFeedPost.payload, ...previousFeedPosts];
      return (previousFeedPosts = allFeedPosts);
    },
    // ToDO: Add remove reducer
    // ToDO: Add update reducer
  },
});

export const feedPostsAction = feedPostsSlice.actions;
export default feedPostsSlice.reducer;
