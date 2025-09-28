import { createSlice } from "@reduxjs/toolkit";
import { allPosts, getAllComments } from "../../action/postAction";

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  postFetched: false,
  message: " ",
  LoggedIn: false,
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builders) => {
    builders
      .addCase(allPosts.pending, (state) => {
        (state.isLoading = true), (state.message = "please wait!");
      })
      .addCase(allPosts.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isError = false),
          (state.postFetched = true),
          (state.posts = action.payload.allPost.reverse());
      })
      .addCase(allPosts.rejected, (state, action) => {
        (state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload);
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
      });
  },
});

export const { resetPostId } = postSlice.actions;

export default postSlice.reducer;
