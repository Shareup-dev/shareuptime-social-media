import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pickerVisible: false,
  images: [],
};

const imagesPickerSlice = createSlice({
  name: "imagesPicker",
  initialState,
  reducers: {
    setImages: (state, action) => {
      return (state.images = action.payload);
    },
    openImagePicker: (state) => {
      state.pickerVisible = true;
    },
    closeImagePicker: (state) => {
      state.pickerVisible = false;
    },
    addImage: (state, action) => {
      return [...state.images, action.payload];
    },
    removeImage: (state, action) => {
      return state.images.filter((image) => image !== action.payload);
    },
  },
});

export const {
  setImages,
  openImagePicker,
  closeImagePicker,
  addImage,
  removeImage,
} = imagesPickerSlice.actions;

export default imagesPickerSlice.reducer;
