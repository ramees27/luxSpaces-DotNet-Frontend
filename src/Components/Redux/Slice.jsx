import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



// Initial state
const initialState = {
  login: false,
  user: null,
  errorMessage: "",
  products: [],
  searchResults: [],
  cart: [],
  orders: [],
  totalAmount:0

};

// Slice
const projectSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = !state.login;
      state.user = action.payload;
      state.errorMessage = "";
    },
    setLogout: (state, action) => {
      state.login = false;
      state.user = null;
      state.errorMessage = "";
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    restoreUser: (state) => {
      const userName = localStorage.getItem("name");
      const userId = localStorage.getItem("id");

      if (userName && userId) {
        state.login = true;
        state.user = { name: userName, id: userId };
      }

    },
    setCart: (state, action) => {
      state.cart = action.payload;
      state.totalAmount = state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
        toast.success("Quantity added", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        state.cart.push({ ...product, quantity: 1 });
        toast.success("Product added to cart successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
      state.totalAmount = state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
      

      // Ensure user is logged in before attempting to update cart in the backend
      if (state.user && state.user.id) {
        axios
          .patch(`http://localhost:5000/users/${state.user.id}`, {
            cart: state.cart, // Update the cart in the database
          })
          .then((response) => {
            console.log("Cart updated successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error updating cart:", error);
            toast.error("Failed to update cart", {
              position: "top-center",
              autoClose: 2000,
            });
          });
      } else {
        toast.error("You need to log in to add items to your cart.", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload; // Get the product ID from action payload
      const productInCart = state.cart.find(item => item.id === productId);

      if (productInCart) {
        productInCart.quantity += 1; // Increase quantity
      }
      state.totalAmount = state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload; // Get the product ID from action payload
      const productInCart = state.cart.find(item => item.id === productId);

      if (productInCart) {
        productInCart.quantity -= 1; // Increase quantity
      }
      state.totalAmount = state.cart.reduce(
        (total, product) => total + product.price * product.quantity,
        0
    );
    
    },
    



    extraReducers: (builder) => {
      builder
        .addCase(searchProducts.pending, (state) => {
          state.searchResults = []; // Clear results while loading
        })
        .addCase(searchProducts.fulfilled, (state, action) => {
          state.searchResults = action.payload;
        })
        .addCase(searchProducts.rejected, (state) => {
          state.searchResults = []; // Clear results on failure
        })
        .addCase(removeFromCart.pending, (state) => {
          // Optionally handle loading state if needed
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {
          state.cart = action.payload; // Update the cart with the new list
        })
        .addCase(removeFromCart.rejected, (state) => {
          // Optionally handle error state if needed
        })
        .addCase(confirmOrder.fulfilled, (state, action) => {
          state.cart = action.payload.cart;
          state.orders = action.payload.orders;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
          state.cart = action.payload;
          console.log(state.cart)
        });
    }
  },
});



// Registar function

export const registerUser = (values, navigate) => async (dispatch) => {
  try {
    // Check if the email already exists
    const response = await axios.get(`http://localhost:5000/users?email=${values.email}`);
    if (response.data.length > 0) {
      dispatch(projectSlice.actions.setErrorMessage("This email is already registered!"));
      return;
    }

    // Register the user
    await axios.post("http://localhost:5000/users", {
      ...values,
      blocked: true,
      cart: [],
      orders: [],
    });

    // Reset error message and navigate to login
    dispatch(projectSlice.actions.setErrorMessage(""));
    navigate("/login", { replace: true });
    toast.success("You successfully registered", {
      position: "top-center",
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Registration error:", error);
    dispatch(projectSlice.actions.setErrorMessage("Something went wrong! Please try again."));
  }
};








// Thunk for login
export const loginUser = (values, navigate) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/users?email=${values.email}`);
    const user = response.data.find((user) => user.email === values.email);
    console.log(user)

    if (user) {
      if (user.password === values.password) {
        if (user.blocked === "true") {
          dispatch(projectSlice.actions.setErrorMessage("Admin blocked by user. You cannot log in."));
          return;
        }

        dispatch(projectSlice.actions.setLogin(user));

        localStorage.setItem("id", user.id);
        localStorage.setItem("name", user.name);

        if (user.role === "admin") {
          navigate("/adminlayout");
        } else {
          navigate("/");
          toast.success("You successfully logged in!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      } else {
        dispatch(projectSlice.actions.setErrorMessage("Incorrect password!"));
      }
    } else {
      dispatch(projectSlice.actions.setErrorMessage("User not found! Please register."));
    }
  } catch (error) {
    dispatch(projectSlice.actions.setErrorMessage("Something went wrong! Please try again later."));
  }
};


// Thunk to fetch all products
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (term) => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      return response.data.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }
);


// remove thunk
export const removeFromCart = createAsyncThunk(
  'app/removeFromCart',
  async (productId, { getState }) => {
    const userId = localStorage.getItem("id");

    if (userId) {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = response.data;
      const updatedCart = user.cart.filter((item) => item.id !== productId);

      // Update the cart in the backend
      await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });

      return updatedCart; // Return the updated cart
    }
  }
);


//   Order Confirm
export const confirmOrder = createAsyncThunk("app/confirmOrder", async ({ navigate }, { getState }) => {

  const state = getState();
  const userId = localStorage.getItem("id"); // Assume userId always exists in this flow

  const response = await axios.get(`http://localhost:5000/users/${userId}`);
  const user = response.data;
  console.log(user)

  const currentDate = new Date().toLocaleString();

  const newOrder = {
    date: currentDate,
    items: user.cart,
    order: Date.now(),
    total: user.cart.reduce((total, product) => total + product.price * product.quantity, 0),
    
  };

  user.orders.push(newOrder);
  user.cart = []; // Clear the cart

  await axios.patch(`http://localhost:5000/users/${userId}`, {
    cart: user.cart,
    orders: user.orders,
    
  });

  toast.success("Order placed successfully!", {
    position: "top-center",
    autoClose: 2000,
  });
  navigate("/myorders");
  return { cart: user.cart, orders: user.orders }



});

// Update cart
// export const fetchCart = createAsyncThunk("app/fetchCart", async () => {
//   const userId = localStorage.getItem("id");
//   const response = await axios.get(`http://localhost:5000/users/${userId}`);
  
//   return response.data.cart; // Assuming cart is returned
// });





// Export actions and reducer
export const { setLogin, setLogout, setErrorMessage, setProducts, setSearchResults, restoreUser, setCart, clearSearchResults, restoreUsersetCart,
  addToCart, increaseQuantity, decreaseQuantity, } = projectSlice.actions;
export default projectSlice.reducer;
