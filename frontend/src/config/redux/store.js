import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";

/**
 * 
 *STEPS for state management

 1. Submit action
 2. handle action in it's Reducer
 3. Register here -> Reducer
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
