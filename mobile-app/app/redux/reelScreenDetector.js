import { createSlice } from '@reduxjs/toolkit';

const reelScreenDetector = createSlice({
  name: 'reelScreenDetector',
  initialState: false,
  reducers: {
    setReelScreen: (_state) => {
      return true;
    },
    unSetReelScreen: (_state) => {
      return false;
    },
  },
});
export default reelScreenDetector;
