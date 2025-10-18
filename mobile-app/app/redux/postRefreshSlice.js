import { createSlice } from '@reduxjs/toolkit';

const postRefreshSlice = createSlice({
  name: 'postRefresh',
  initialState: false,
  reducers: {
    setPostRefresh: (_previousState, newState) => {
      return newState.payload;
    },
    clearPostRefresh: (_previousState) => {
      return false;
    },
  },
});

export const postRefreshAction = postRefreshSlice.actions;
export default postRefreshSlice.reducer;
