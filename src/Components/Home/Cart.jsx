
import React, { useEffect, useState, useContext } from 'react';
// import { userContext } from '../Context/Context';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCart,removeFromCart } from '../Redux/Slice';

const Cart = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const totalAmount = useSelector((state) => state.app.totalAmount);
  
  const cart = useSelector((state) => state.app.cart)

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  // Remove function
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId)); // Dispatch the asyncThunk
  };



  useEffect(() => {
    const userId = localStorage.getItem("id");
if (userId) {
      // Fetch user data from the API using the userId
      axios
        .get(`http://localhost:5000/users/${userId}`)
        .then((response) => {
          const userCart = response.data.cart; // Assuming `cart` is an array on the user object
          // Dispatch the fetched cart to Redux store
          dispatch(setCart(userCart));
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [dispatch,handleRemoveFromCart]);

 

// increase Qty
  const increaseQuantityHandler = async (productId) => {
    const userId = localStorage.getItem("id");
  
    if (userId) {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = response.data;
      const updatedCart = user.cart.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );
      await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });
      dispatch(setCart(updatedCart));
    }
  };



// decrease Qty
  const decreaseQuantityHandler = async (productId) => {
    const userId = localStorage.getItem("id");
  
    if (userId) {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const user = response.data;
      const updatedCart = user.cart.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity > 1 ? product.quantity - 1 : product.quantity}
          : product
      );
      await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });
      dispatch(setCart(updatedCart));
    }
  };

 
  
  // const totalAmount = () => {
  //   return cart.reduce((total, product) => total + product.price * product.quantity, 0);
  // };
  






  const handlePlaceOrder = () => {
    navigate("/order");
  };


  return (
    <div className="bg-gray-50 min-h-screen pt-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Your Cart
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-lg text-gray-600 py-10">
            Your cart is empty.
          </p>
        ) : (
          <div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
              {cart.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg h-96 shadow-md hover:shadow-lg transition overflow-hidden"
                >

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    style={{ objectFit: 'contain' }}
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-2">Price: ₹{product.price}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        className="bg-stone-700 text-white font-semibold py-1 px-3 text-sm rounded-lg hover:bg-stone-600"
                        onClick={() => increaseQuantityHandler(product.id)}
                      >
                        +
                      </button>
                      <span className="text-gray-800 font-semibold">
                        {product.quantity}
                      </span>
                      <button
                        className="bg-stone-700 text-white font-semibold py-1 px-3 text-sm rounded-lg hover:bg-stone-600"
                        onClick={() => decreaseQuantityHandler(product.id)}
                      >
                        -
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      ₹{product.price * product.quantity}
                    </span>
                    <button
                      className="py-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>


            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold text-gray-800">
                Total Amount: ₹{totalAmount}
              </h3>
              <button
                className="mt-4 py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => handlePlaceOrder()}
              >
                Place Order
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-4 py-2 bg-stone-800 text-white font-semibold rounded-lg hover:bg-stone-900 "
        >
          <FaHome className="mr-2" size={20} />
          Home
        </button>
      </div>
    </div>
  );
};

export default Cart;
