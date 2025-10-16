import { createSlice } from '@reduxjs/toolkit';

const groupPostsSlice = createSlice({
  name: 'groupPostsSlice',
  initialState: [],
  reducers: {
    setPosts: (oldPosts, newPost) => {
      return (oldPosts = newPost.payload);
    },
    removePost: () => {},
    getPosts: (state) => {
      return state;
    },
  },
});
export const groupPostsActions = groupPostsSlice.actions;
export default groupPostsSlice.reducer;
