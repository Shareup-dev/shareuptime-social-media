import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  like: 0,
};

export const likeSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.like += 1;
    },
    decrement: (state) => {
      state.like -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = likeSlice.actions;

export default likeSlice.reducer;
