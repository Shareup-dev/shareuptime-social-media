import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feeling: null,
  img: null,
  icon: null,
  color: null,
  type: null,
};

const postFeelingsSlice = createSlice({
  name: 'postFeelings',
  initialState: initialState,
  reducers: {
    setFeel: (oldValue, newValue) => {
      return (oldValue = newValue.payload);
    },
    setDefault: (currentValue) => {
      return (currentValue = initialState);
    },
    getPosts: (state) => {
      return state.value;
    },
  },
});
export const postFeelingsActions = postFeelingsSlice.actions;
export default postFeelingsSlice.reducer;
