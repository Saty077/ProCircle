import { createSlice } from "@reduxjs/toolkit";
import {
  aboutUserData,
  loginUser,
  registerUser,
} from "../../action/authAction";

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: " ",
  profileFetched: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setIsTokenThere: (state) => {
      state.isTokenThere = true;
    },
    setIsTokenNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        (state.isLoading = true), (state.message = "knocking the door...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = true),
          (state.message = "Login is successfull");
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload.message);
      })
      .addCase(registerUser.pending, (state) => {
        (state.isLoading = true), (state.message = "registering the user");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.message = "Registration Successful, please login");
      })
      .addCase(registerUser.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload.message);
      })
      .addCase(aboutUserData.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.profileFetched = true),
          (state.user = action.payload.profile);
      });
  },
});

export const { reset, emptyMessage, setIsTokenThere, setIsTokenNotThere } =
  authSlice.actions;

export default authSlice.reducer;
