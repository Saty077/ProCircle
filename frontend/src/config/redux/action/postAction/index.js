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

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, ThunkAPI) => {
    const { file, body } = userData;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("body", body);
      formData.append("media", file);
      console.log("ok, ok");

      const response = await createServer.post("/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("ok, ok12");

      if (response.status === 200) {
        return ThunkAPI.fulfillWithValue("post Uploaded");
      } else {
        return ThunkAPI.rejectWithValue("post not Uploaded");
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, ThunkAPI) => {
    try {
      const response = await createServer.delete("/delete_post", {
        data: {
          token: localStorage.getItem("token"),
          post_id: post_id.post_id,
        },
      });
      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const incLikes = createAsyncThunk(
  "post/like",
  async (post, ThunkAPI) => {
    try {
      const response = await createServer.post("/increment_likes", {
        post_id: post.post_id,
      });

      return ThunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return ThunkAPI.rejectWithValue(error.response.data);
    }
  }
);
