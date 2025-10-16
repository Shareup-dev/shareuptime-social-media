import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.list = action.payload;
    },
    addConversation: (state, action) => {
      state.list = [action.payload, ...state.list];
    },
    updateConversations: (state, action) => {
      state.list = [...state.list, ...action.payload];
    },
  },
});

export const conversationAction = conversationsSlice.actions;
export default conversationsSlice.reducer;
