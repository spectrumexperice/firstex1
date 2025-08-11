import { createSlice } from "@reduxjs/toolkit";


const initialValue = { // الحاله الابتدائيه
  _id: "",
  name: "",
  email: "",
  mobile: "",
  verify_email: "",
  last_login_date: "",
  address_details: [],
  shopping_cart: [],
  orderHistory: [],
  role: "",
};

const userSlice = createSlice({
  name: "user",
  initialState:initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    logoutUser:()=>initialValue
  },
});

export const { setUserDetails, logoutUser } = userSlice.actions;
export default userSlice.reducer;
