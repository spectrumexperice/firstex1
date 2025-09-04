import { createSlice } from "@reduxjs/toolkit";


const initialValue = { // الحاله الابتدائيه
  works: [],
  loading: false,
  error: null,
};

const worksSlice = createSlice({
  name: "works",
  initialState:initialValue,
  reducers: {
    setWorksDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    
  },
});

export const { setWorksDetails } = worksSlice.actions;
export default worksSlice.reducer;
