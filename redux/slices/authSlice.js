import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  isAuthenticated: false,
  userData: null,
};

const authSlice = createSlice({
  name: "authYoa",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userData = action.payload.userData;
    },
    clearCredentials: (state) => {
      return initialState;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

