import { createSlice } from "@reduxjs/toolkit";

const groupScreenDetector = createSlice({
  name: "groupScreenDetector",
  initialState: false,
  reducers: {
    setGroupScreen: (state) => {
      return (state = true);
    },
    unSetGroupScreen: (state) => {
      return (state = false);
    },
  },
});
export default groupScreenDetector;
