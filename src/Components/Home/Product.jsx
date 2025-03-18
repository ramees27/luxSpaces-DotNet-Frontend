import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa'


import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Slice';
import api from '../../../Api/api';

const Product = () => {
  const { pathname } = useLocation();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  const dispatch = useDispatch()


  const [products, setProducts] = useState([]);


  const handleAddToCart = (furniture) => {

    // Dispatching addToCart action to Redux
    dispatch(addToCart(furniture)); // `furniture` is the product being added to the cart
  };





  useEffect(() => {

    api.get('/api/Products/get-all')
      .then((response) => {
        if (response.data.statusCode === 200) {
          setProducts(response.data.data);
          console.log(response.data.data)
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

  }, []);


  const fetchWishlist = async () => {
    try {
      const response = await api.get("/api/Wishlist/get-all");
      if (response.data?.statusCode === 200) {
        setWishlist(response.data.data.map((item) => item.id)); // Store only product IDs
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);

    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);










  return (
    <div className="max-w-7xl mx-auto p-6 select-none ">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center tracking-wide text-shadow-lg">
        Explore Our Collection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 justify-items-center align-items-center bg-rose-50">
        {products.map((furniture) => (
          <div
            key={furniture.id}
            className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl">





            <Link to={`/details/${furniture.id}`}>
              <img src={furniture.imgUrl}
                alt={furniture.name}
                className="h-48 w-full object-cover rounded-t-md"
                style={{ objectFit: "contain" }} />
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800">{furniture.name}</h2>
                <p className="text-lg font-bold text-blue-500 mt-2">₹{furniture.price}</p>
              </div>
            </Link>

            <div className="flex justify-center mt-4">
              <button onClick={() => handleAddToCart(furniture)} className="flex items-end bg-- bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold py-1 px-3  shadow-md transform transition-transform duration-300 hover:scale-105 focus:outline-none">
                <FaShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
