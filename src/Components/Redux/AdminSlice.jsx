import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  adminProduct: [],
  
};


const adminCreateSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.adminProduct = action.payload;
          })
          
          .addCase(editProduct.fulfilled, (state, action) => {
            const updatedProduct = action.payload;
            state.adminProduct = state.adminProduct.map((product) =>
              product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            );
          })
          .addCase(addProduct.fulfilled, (state, action) => {
            state.adminProduct.push(action.payload);
          })
          .addCase(deleteProduct.fulfilled, (state, action) => {
            const productId = action.payload;
            state.adminProduct = state.adminProduct.filter((product) => product.id !== productId);
          });
        
    },
  });



  export const fetchProducts = createAsyncThunk(
    'admin/fetchProducts',
    async () => {
      const response = await axios.get("http://localhost:5000/products");
      return response.data;
    }
  );



  export const editProduct = createAsyncThunk(
  'admin/editProduct',
  async (updatedProduct) => {
    await axios.put(`http://localhost:5000/products/${updatedProduct.id}`, updatedProduct);
    return updatedProduct;
  }
);


export const addProduct = createAsyncThunk(
    'admin/addProduct',
    async (newProduct) => {
      const response = await axios.post("http://localhost:5000/products", newProduct);
      return response.data;
    }
  );


  export const deleteProduct = createAsyncThunk(
    'admin/deleteProduct',
    async (productId) => {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      return productId;
    }
  );

export default adminCreateSlice.reducer;