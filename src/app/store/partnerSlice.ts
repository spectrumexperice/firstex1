import { createSlice } from "@reduxjs/toolkit";


const initialValue = { // الحاله الابتدائيه
  partners: [],
  loading: false,
  error: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState:initialValue,
  reducers: {
    setpartnerDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    
  },
});

export const { setpartnerDetails } = partnerSlice.actions;
export default partnerSlice.reducer;
