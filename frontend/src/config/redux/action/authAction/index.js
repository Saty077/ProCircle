import { createServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await createServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const request = await createServer.post("/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });

      // if (response.status(200)) {
      //   return response.data.message;
      // } else {
      //   return thunkAPI.rejectWithValue(response.data.message);
      // }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const aboutUserData = createAsyncThunk(
  "user/aboutUserData",
  async (user, ThunkAPI) => {
    try {
      const response = await createServer("/get_user_and_profile", {
        //
        params: {
          token: user.token,
        },
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, ThunkAPI) => {
    try {
      const response = await createServer("/user/get_all_user"); //
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.message);
    }
  }
);
