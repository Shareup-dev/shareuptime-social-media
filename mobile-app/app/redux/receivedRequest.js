import { createSlice } from '@reduxjs/toolkit';

let initialState = [];

const receivedRequestSlice = createSlice({
  name: 'receivedRequestSlice',
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

export const receivedRequestsActions = receivedRequestSlice.actions;

export default receivedRequestSlice.reducer;
