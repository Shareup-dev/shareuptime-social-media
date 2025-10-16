import { createSlice } from '@reduxjs/toolkit';

const reelScreenDetector = createSlice({
  name: 'reelScreenDetector',
  initialState: false,
  reducers: {
    setReelScreen: (state) => {
      return (state = true);
    },
    unSetReelScreen: (state) => {
      return (state = false);
    },
  },
});
export default reelScreenDetector;
