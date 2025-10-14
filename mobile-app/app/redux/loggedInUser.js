import {createSlice} from '@reduxjs/toolkit';

let initialState = {};
const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logOut: () => {},
    setUser: (state, user) => {
      return (state = user);
    },
    checkCurrentState: state => {
      return state;
    },
  },
});
export const loggedInUserActions = userSlice.actions;

export default userSlice;
