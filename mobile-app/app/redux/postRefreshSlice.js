import {createSlice} from '@reduxjs/toolkit';

const postRefreshSlice = createSlice({
  name: 'postRefresh',
  initialState: false,
  reducers: {
    setPostRefresh: (previousState,newState) => {
      return (previousState = newState.payload);
    },
    clearPostRefresh: (previousState) => {
      return (previousState = false);
    },
  },
});

export const postRefreshAction = postRefreshSlice.actions;
export default postRefreshSlice.reducer;
