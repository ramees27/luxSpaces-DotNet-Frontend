import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../Api/api";



// Initial state
const initialState = {
  login: false,
  user: null,
  errorMessage: "",
  products: [],
  searchResults: [],
  cart: [],
  orders: [],
  totalAmount: 0

};

// Slice
const projectSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.login = true;
      state.user = action.payload;
      state.errorMessage = "";
    },
    setLogout: (state) => {
      state.login = false;
      state.user = null;
      state.errorMessage = "";

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("name");
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    restoreUser: (state) => {
      const userName = localStorage.getItem("name");
      const accessToken = localStorage.getItem("accessToken");

      if (userName && accessToken) {
        state.login = true;
        state.user = { name: userName };
      }
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },










    extraReducers: (builder) => {
      builder
        .addCase(searchProducts.pending, (state) => {
          state.searchResults = [];
        })
        .addCase(searchProducts.fulfilled, (state, action) => {
          state.searchResults = action.payload;
        })
        .addCase(searchProducts.rejected, (state) => {
          state.searchResults = [];
        })

        .addCase(confirmOrder.fulfilled, (state, action) => {
          state.cart = action.payload.cart;
          state.orders = action.payload.orders;
        })
        .addCase(removeFromCart.fulfilled, (state, action) => {

          state.cart = state.cart.filter((item) => item.id !== action.payload);
        });

    }
  },
});



// Registar function

export const registerUser = (values, navigate) => async (dispatch) => {
  try {
    const response = await api.post("/api/users/Register", values);

    if (response.data.statusCode === 200) {
      dispatch(projectSlice.actions.setErrorMessage(""));
      navigate("/login", { replace: true });

      toast.success("You successfully registered", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    dispatch(projectSlice.actions.setErrorMessage(error.response.data.message));
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 2000,
    });
  }
};









// Thunk for login
export const loginUser = (values, navigate) => async (dispatch) => {
  try {
    const response = await api.post("/api/users/Login", values);

    if (response.data.statusCode === 200) {
      const { accessTocken, refreshTocken, name, role } = response.data.data;
      console.log(response.data.data)

      localStorage.setItem("accessToken", accessTocken);
      localStorage.setItem("refreshToken", refreshTocken);
      localStorage.setItem("name", name);
      localStorage.setItem("Role", role)

      dispatch(projectSlice.actions.setLogin({ name: name }));

      if (role === "admin") {
        navigate("/adminlayout");
      } else {
        navigate("/");
      }



      toast.success("You successfully logged in!", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error("Invalid login attempt", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(projectSlice.actions.setErrorMessage(error.response.data.message));
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 2000,
    });
  }
};






// add to cart
export const addToCart = (product) => async (dispatch) => {
  const token = localStorage.getItem("accessToken"); // Check for access token

  if (!token) {
    toast.error("Please Login to add Product to cart", {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }
  try {
    const response = await api.post(
      `api/Cart/add-to-cart?productId=${product.id}`

    );


    if (response.status === 200) {
      console.log(response)
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 2000,
      });
    }
    fetchCartItems();

  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error(error.response.data.message, {
      position: "top-center",
      autoClose: 2000,
    });
  }
};





// Fetch the cart items

export const fetchCartItems = () => async (dispatch) => {
  try {
    const response = await api.get("/api/Cart/get-all");
    if (response.data.statusCode === 200) {

      dispatch(projectSlice.actions.setCart(response.data.data));

      console.log(response.data.data)
    }
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};


// remove from cart

export const removeFromCart = createAsyncThunk(
  "app/removeFromCart",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/Cart/remove-from-cart?productId=${productId}`);

      if (response.status === 200) {
        dispatch(fetchCartItems())
        return productId;
      }
    }
    catch (error) {
      console.error("Error removing item:", error);
      return rejectWithValue(error.response?.data || "Failed to remove item");
    }

  }
);

// Increase Qty
export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/Cart/increase-quantity?productId=${productId}`);

      if (response.status === 200) {
        dispatch(fetchCartItems());
        return productId;
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
      return rejectWithValue(error.response?.data || "Failed to increase quantity");
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/api/Cart/decrease-quantity?productId=${productId}`);

      if (response.status === 200) {
        dispatch(fetchCartItems());
        return productId;
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      return rejectWithValue(error.response?.data || "Failed to decrease quantity");
    }
  }
);










//   Order Confirm
export const confirmOrder = createAsyncThunk("app/confirmOrder", async ({ navigate }, { getState }) => {

  const state = getState();
  const userId = localStorage.getItem("id"); 

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
  user.cart = [];

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







export const { setLogin, setLogout, setErrorMessage, setProducts, setSearchResults, restoreUser, setCart, clearSearchResults, restoreUsersetCart,
  addProductToCart } = projectSlice.actions;

export default projectSlice.reducer