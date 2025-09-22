import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

/**
 * 
 *STEPS for state management

 1. Submit the action
 2. handle action in it's Reducer
 3. Register here -> Reducer
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer,
  },
});
