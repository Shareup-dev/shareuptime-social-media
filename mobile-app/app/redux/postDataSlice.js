import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postImages: [],
  groupId: null,
  postDetail: [],
  EditPost: false,
  tagedList: { ids: [], names: [] },
  Album: {},
};

const postDataSlice = createSlice({
  name: 'postDataSlice',
  initialState: initialState,
  reducers: {
    setImages: (previousState, newState) => {
      previousState.postImages = [...previousState.postImages, ...newState.payload];
      return previousState;
    },
    removeAllImages: (previousState) => {
      previousState.postImages = [];
      return previousState;
    },
    removeImage: (previousState, _key) => {
      // keep param underscore-named to satisfy unused var rule while preserving signature
      previousState.postImages = previousState.postImages.filter((item) => item !== _key.payload);
      return previousState;
    },
    addNewImage: (previousState, newState) => {
      previousState.postImages = newState.payload;
      return previousState;
    },
    //..............GROUP_ID.......................
    setGroupId: (previousState, newState) => {
      previousState.groupId = newState.payload;
      return previousState;
    },
    removeGroupId: (previousState) => {
      previousState.groupId = null;
      return previousState;
    },
    //................POST_DATA.....................
    setPostData: (previousState, newState) => {
      previousState.postDetail = newState.payload;
      return previousState;
    },
    removePostData: (previousState) => {
      previousState.postDetail = [];
      return previousState;
    },
    //.................EDIT_POST....................
    setEditPost: (previousState, newState) => {
      previousState.EditPost = newState.payload;
      return previousState;
    },
    removeEditPost: (previousState) => {
      previousState.EditPost = false;
      return previousState;
    },
    //.................TAGED_LIST....................
    setTagList: (previousState, newState) => {
      previousState.tagedList.ids = [...previousState.tagedList.ids, ...newState.payload.ids];
      previousState.tagedList.names = [...previousState.tagedList.names, ...newState.payload.names];
      return previousState;
    },
    clearTagList: (previousState) => {
      previousState.tagedList = { ids: [], names: [] };
      return previousState;
    },
    removeFromTagList: (previousState, key) => {
      previousState.tagedList = previousState.tagedList.filter((item) => item !== key.payload);
      return previousState;
    },

    //...................ALBUM...........................
    addAlbum: (previousState, newState) => {
      previousState.Album = newState.payload;
    },
    removeAlbum: (previousState, _key) => {
      previousState.Album = {};
      return previousState;
    },
  },
});
export default postDataSlice;
export const postDataSliceAction = postDataSlice.actions;
