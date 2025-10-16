import { createSlice } from '@reduxjs/toolkit';

const swapedImages = createSlice({
  name: 'swapedImages',
  initialState: [],
  reducers: {
    setImages: (previousState, newImages) => {
      return (previousState = newImages.payload);
    },
    removeImages: (previousState, swapId) => {
      let newSwaps = previousState.filter((swapPost) => swapPost.swapPostId !== swapId.payload);
      return (previousState = newSwaps);
    },
  },
});
export default swapedImages;
export const swapedImagesAction = swapedImages.actions;
