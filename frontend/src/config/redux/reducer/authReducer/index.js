import { createSlice } from "@reduxjs/toolkit";
import {
  aboutUserData,
  getAllUsers,
  getConnectionRequest,
  getMyConnections,
  loginUser,
  registerUser,
  sendConnectionRequest,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: " ",
  profileFetched: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello"; // tese are reducers, each can have state and action as parameter. and direct mutation is possbile no need for copying prvious values
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
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.all_profiles_fetched = true),
          (state.all_users = action.payload.Profiles);
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { reset, emptyMessage, setIsTokenThere, setIsTokenNotThere } =
  authSlice.actions;

export default authSlice.reducer;
