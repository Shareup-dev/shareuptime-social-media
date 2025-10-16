import { createSlice } from '@reduxjs/toolkit';

const registrationSlice = createSlice({
  name: 'registrationSlice',
  initialState: {},
  reducers: {
    appendFields: (previousFields, newFields) => {
      return { ...previousFields, ...newFields.payload };
    },
  },
});
export default registrationSlice;
