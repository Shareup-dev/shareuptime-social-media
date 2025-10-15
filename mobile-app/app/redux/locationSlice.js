import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setlocation: (state, newState) => {
      return (state = newState.payload);
    },
  },
});

export const locationActions = locationSlice.actions;

export default locationSlice;
