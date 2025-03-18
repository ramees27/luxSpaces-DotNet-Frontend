import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaHeart } from "react-icons/fa";
import api from "../../../Api/api";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // ✅ Fetch Wishlist Items
  useEffect(() => {
    api.get("/api/WishList/get-all")
      .then((response) => {
        if (response.data.statusCode === 200) {
          setWishlistItems(response.data.data);
          
        }
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, []);
  console.log(wishlistItems)

  

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 mt-8 text-center tracking-wide ">
        My Wishlist
      </h1>

      {/* ✅ If Wishlist is Empty */}
      {wishlistItems.length === 0 ? (
        <div className="text-center mt-10">
          <FaHeart size={50} className="text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-500">Your wishlist is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-lg transition"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 bg-gray-50">
          {wishlistItems.map((product) => (
            <div
              key={product.whishListGetId}
              className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl relative"
            >
              {/* ✅ Remove from Wishlist Button */}
         

              {/* ✅ Product Details */}
              <Link to={`/details/${product.productId}`}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-48 w-full object-cover rounded-t-md"
                  style={{ objectFit: "contain" }}
                />
                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-lg font-bold text-blue-500 mt-2">₹{product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
