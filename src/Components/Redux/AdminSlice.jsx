import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../Api/api";


// Fetch all products
export const fetchProducts = createAsyncThunk("admin/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await api .get("/api/Products/get-all");
    return response.data.data;
    
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
  }
});



// Delete a product
export const deleteProduct = createAsyncThunk("admin/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/Products/deleted/${id}`);
    return id; 
  } catch (error) {
    console.log(error)
    return rejectWithValue(error.response?.data?.message || "Failed to delete product");
  }
});


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  },
});


export default adminSlice.reducer;
