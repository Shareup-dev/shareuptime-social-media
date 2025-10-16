import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
  name: 'messages',
  initialState: [],
  reducers: {
    setMessages: (previousState, newMessages) => {
      return (previousState = newMessages.payload);
    },
    addMessage: (previousMessages, newMessage) => {
      let allMessages = [newMessage.payload, ...previousMessages];
      return (previousMessages = allMessages);
    },
    updateMessagesList: (previousMessages, newMessages) => {
      let allMessages = [...previousMessages, ...newMessages.payload];

      return (previousMessages = allMessages);
    },
    // ToDO: Add remove reducer
  },
});

export const messagesAction = messagesSlice.actions;
export default messagesSlice.reducer;
