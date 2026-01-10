import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  user: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action) => {
      state.token = action.payload.token;
    },
    userLogin: (state, action) => {
      state.user = action.payload.user;
      // Support both payload shapes (some callers used `token`, others used `accessToken`)
      state.token = action.payload.accessToken ?? action.payload.token ?? "";
    },
    userLoggedOut: (state) => {
      state.user = "";
      state.token = "";
    },
  },
});

export const { userRegistration, userLogin, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;