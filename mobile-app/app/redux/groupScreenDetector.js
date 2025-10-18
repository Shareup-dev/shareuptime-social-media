import { createSlice } from '@reduxjs/toolkit';

const groupScreenDetector = createSlice({
  name: 'groupScreenDetector',
  initialState: false,
  reducers: {
    setGroupScreen: (_state) => {
      // return new state explicitly to avoid assigning to the param
      return true;
    },
    unSetGroupScreen: (_state) => {
      // return new state explicitly to avoid assigning to the param
      return false;
    },
  },
});
export default groupScreenDetector;
