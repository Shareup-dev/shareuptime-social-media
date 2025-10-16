import { createSlice } from '@reduxjs/toolkit';

let initialState = [];

const recentSearch = createSlice({
  name: 'recentSearch',
  initialState,
  reducers: {
    setList: (state, newState) => {
      return (state = newState.payload);
    },
    cancelRequest: () => {},
    getList: (state) => {
      return state.payload;
    },
  },
});

export const recentSearchActions = recentSearch.actions;

export default recentSearch.reducer;
