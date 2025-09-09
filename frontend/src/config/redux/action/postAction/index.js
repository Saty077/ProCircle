import { createServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

//submit and action, here(action) => handle Reducer in [reducer] => register Reducer in [store]

export const allPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, ThunkAPI) => {
    try {
      const response = await createServer.get("/all_posts");
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
