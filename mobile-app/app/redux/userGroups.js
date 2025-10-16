import { createSlice } from '@reduxjs/toolkit';

const userGroupsSlice = createSlice({
  initialState: [],
  name: 'userGroupsSlice',
  reducers: {
    setGroups: (oldGroups, newGroups) => {
      return (oldGroups = newGroups.payload);
    },
  },
});

export const userGroupActions = userGroupsSlice.actions;
export default userGroupsSlice.reducer;
