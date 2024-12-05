import React, { createContext, useState,useEffect } from 'react'
export const userContext=createContext() 
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const Context = ({children}) => {
    const[cart,setCart]=useState([])
    const[login,setLogin]=useState(false);
    const naviagte=useNavigate()


    useEffect(() => {
      const userId = localStorage.getItem('id'); 
      if (userId) {
          setLogin(true); 
      }
  }, []);



  const searchProducts = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:5000/products`);
      return response.data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };


// adding product to cart
const addToCart = async (product) => {
  const userId = localStorage.getItem("id");

  if (!userId) {
    toast.error("Please log in to add items to your cart.", {
      position: "top-center",
      autoClose: 2000, 
    });
    naviagte("/login");
    return;
  }



 const response = await axios.get(`http://localhost:5000/users/${userId}`);
  const user = response.data;

  
  const existingProduct = user.cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
    toast.success("Quantity added", {
      position: "top-center",
      autoClose: 2000,
    });
  } else {
    
    user.cart.push({ ...product, quantity: 1 });
    toast.success("Product added to cart successfully!", {
      position: "top-center",
      autoClose: 2000, 
    });
  }

   await axios.patch(`http://localhost:5000/users/${userId}`, { cart: user.cart });

  
  setCart(user.cart);
};

// cart ui
useEffect(() => {
  const userId = localStorage.getItem('id'); 

    axios
    .get(`http://localhost:5000/users/${userId}`)
    .then((response) => {
      setCart(response.data.cart); 
    })
    
}, []); 





// Quantity increment
 
  const increaseQuantity = async (productId) => {
  const userId = localStorage.getItem("id"); 
   
  const response = await axios.get(`http://localhost:5000/users/${userId}`);
  const user = response.data; 
  const productInCart = user.cart.find((item) => item.id === productId);
  
  productInCart.quantity += 1;

  await axios.patch(`http://localhost:5000/users/${userId}`, { cart: user.cart });
  setCart(user.cart);
};







// quantity decremeant
const decreaseQuantity = async (productId) => {
  const userId = localStorage.getItem("id");

  const response = await axios.get(`http://localhost:5000/users/${userId}`);
  const user = response.data;

  const productInCart = user.cart.find((item) => item.id === productId);
   if (productInCart.quantity > 1) {
    productInCart.quantity -= 1;
  }

  await axios.patch(`http://localhost:5000/users/${userId}`, { cart: user.cart });
  setCart(user.cart);
};



    // Remove a product from the cart
    const removeFromCart = async (productId) => {
    const userId = localStorage.getItem('id');
    const response = await axios.get(`http://localhost:5000/users/${userId}`);
    const user = response.data;
    const updatedCart = user.cart.filter((item) => item.id !== productId);
    await axios.patch(`http://localhost:5000/users/${userId}`, { cart: updatedCart });
    setCart(updatedCart);
  }

  




  // confirm order
const confirmOrder = async () => {
  const userId = localStorage.getItem("id");
  const response = await axios.get(`http://localhost:5000/users/${userId}`);
  const user = response.data;

  
  const currentDate = new Date().toLocaleString();

  // order object creat
  const newOrder = {
    date: currentDate,
    items: user.cart,
    order:Date.now(),
    total:totalAmount()
  
  };

  
  user.orders.push(newOrder);

  // Empty the cart
  user.cart = [];

  // Update the user data with the new orders and empty cart
  await axios.patch(`http://localhost:5000/users/${userId}`, {
    cart: user.cart,
    orders: user.orders
  });
  setCart(user.cart);
   naviagte("/myorders");
   toast.success("Order placed successfully!", {
    position: "top-center",
    autoClose: 2000, 
  });
};


// price Calculation
const totalAmount = () => {
  return cart.reduce((total, product) => total + product.price * product.quantity, 0);
};



return (
    <div>
      <userContext.Provider value={{login,setLogin,cart,addToCart,removeFromCart,decreaseQuantity,increaseQuantity,confirmOrder,totalAmount,searchProducts }}>
        {children}
        </userContext.Provider>
    </div>
  )
}

export default Context