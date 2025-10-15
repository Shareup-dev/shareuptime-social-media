import {createSlice} from '@reduxjs/toolkit';

const usersPostSlice = createSlice({
  name: 'userPost',
  initialState: [],
  reducers: {
    getPosts: (previousState, newPost) => {
      return (previousState = newPost.payload);
    },
    addPost: (previousStates, newPost) => {
      const allPost = [previousStates, newPost.payload];
      return (previousStates = allPost);
    },
  },
});

export const usersPostActions = usersPostSlice.actions;
export default usersPostSlice.reducer;
