import { createSlice } from "@reduxjs/toolkit";


const initialValue = { // الحاله الابتدائيه
  categories: [],
  loading: false,
  error: null,
};

const CategoriesSlice = createSlice({
  name: "categorie",
  initialState:initialValue,
  reducers: {
    setCategoriesDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
      setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    
  },
});

export const { setCategoriesDetails ,loading,error} = CategoriesSlice.actions;
export default CategoriesSlice.reducer;
