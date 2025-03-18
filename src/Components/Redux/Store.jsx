import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./Slice"
import adminReducer  from "./AdminSlice"

// Configure the Redux store
const store = configureStore({
  reducer: {
    app: projectSlice,
    admin: adminReducer, // Add your slice reducer here
  },
});

export default store;
