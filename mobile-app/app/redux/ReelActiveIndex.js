import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeIndex: 0,
};

export const reelActiveIndex = createSlice({
  name: "activeIndex",
  initialState,
  reducers: {
    onActiveIndexChanged: (state,action) => {
      state.activeIndex = action.payload
    }, 
  },
});

// Action creators are generated for each case reducer function
export const { onActiveIndexChanged } = reelActiveIndex.actions;

export default reelActiveIndex.reducer;
