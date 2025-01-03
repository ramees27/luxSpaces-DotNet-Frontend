import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./Slice"; 
import adminCreateSlice from './AdminSlice'

// Configure the Redux store
const store = configureStore({
  reducer: {
    app: projectSlice,
    admin: adminCreateSlice, // Add your slice reducer here
  },
});

export default store;
