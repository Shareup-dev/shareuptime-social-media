import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComment: (state, newState) => {
      return (state = newState.payload);
    },
    getComments: (state) => {
      return state.payload;
    },
  },
});

export const commentsActions = commentsSlice.actions;

export default commentsSlice.reducer;
