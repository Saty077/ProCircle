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

//feature = post, auth
//reducer = events with action (event(if this action occurs what should reducer do)), state
// slice = for indivdual features(we have reducer, action logic)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postReducer: postReducer,
  },
});
