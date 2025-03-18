import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/Slice";
import api from "../../../Api/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const Details = () => {
  const { pathname } = useLocation();
  const { furnitureId } = useParams(); 
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ✅ Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/Products/productId?id=${furnitureId}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (furnitureId) {
      fetchProduct();
    }
  }, [furnitureId]);

  // ✅ Fetch Wishlist Items on Page Load
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/api/WishList/get-all");
        if (response.data?.statusCode === 200) {
          setWishlist(response.data.data.map(item => item.productId)); // Store product IDs
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // ✅ Handle Wishlist Toggle
  const handleWishlistToggle = async (productId) => {
    const token = localStorage.getItem("accessToken"); // Check for access token

    if (!token) {
      toast.error("Please log in to manage your wishlist", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await api.post(`/api/WishList/add-or-remove?prodctId=${productId}`);
      if(response.data.statusCode==200){
      toast.success(response.data?.message, {
        position: "top-center",
        autoClose: 2000,
      });
      }

      // Update Wishlist State
      setWishlist((prevWishlist) =>
        prevWishlist.includes(productId)
          ? prevWishlist.filter((id) => id !== productId) // Remove from wishlist
          : [...prevWishlist, productId] // Add to wishlist
      );
    } catch (error) {
      console.error("Error updating wishlist:", error);
      
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 select-none">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 relative">
        {/* Wishlist Button */}
        <button
          onClick={() => handleWishlistToggle(product.id)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
        >
          {wishlist.includes(product.id) ? (
            <FaHeart size={24} className="text-red-500" />
          ) : (
            <FaRegHeart size={24} />
          )}
        </button>

        <div className="p-8 flex flex-col lg:flex-row items-center lg:items-start">
          <img
            src={product.imgUrl}
            alt={product.name}
            style={{ objectFit: "contain" }}
            className="w-full lg:w-1/2 h-80 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110"
          />
          <div className="lg:ml-10 mt-6 lg:mt-0 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700 mb-2">
              <strong>Price:</strong> ₹ {product.price}{" "}
              <span className="line-through text-red-500">₹{product.oldPrice}</span>
            </p>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Category:</strong> {product.category}
            </p>
          </div>
        </div>

        <div className="p-6 flex justify-center">
          <button
            onClick={() => dispatch(addToCart(product))}
            className="bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-full hover:bg-green-600 focus:outline-none transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
