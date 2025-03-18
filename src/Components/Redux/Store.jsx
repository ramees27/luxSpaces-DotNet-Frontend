import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./Slice"
import adminReducer  from "./AdminSlice"


const store = configureStore({
  reducer: {
    app: projectSlice,
    admin: adminReducer, 
  },
});

export default store;
