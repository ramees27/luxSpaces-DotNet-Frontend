import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaChair, FaSearch } from "react-icons/fa";

import { toast } from "react-toastify";
import {  searchProducts,setLogout,restoreUser} from "../Redux/Slice"
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);
  const login = useSelector((state) => state.app.login);
  const searchResults = useSelector((state) => state.app.searchResults);

  const handleCarticon = () => {
    const userId = localStorage.getItem("id");
    if (userId) {
      navigate("/cart");
    } else {
      toast.error("Please log in to view your cart.", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/login");
    }
  };

  const handleLogout = () =>  {

    localStorage.clear();
     dispatch(setLogout());
    navigate("/");
    toast.success("You successfully logged out", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  

  // search function

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      dispatch(searchProducts("")); // Clear search results
      return;
    }

    dispatch(searchProducts(term)); // Fetch filtered results
  };

  const handleProductClick = (productId) => {
    navigate(`/details/${productId}`); // Navigate to product details
    setSearchTerm(""); // Clear local state
    dispatch(searchProducts("")); // Clear Redux state
  };


  useEffect(() => {
    // Try restoring the user from localStorage when the app loads
    dispatch(restoreUser());
  }, [dispatch]);
  
  return (
    <div>
      <nav
        className="w-full fixed top-0 left-0 z-50 shadow-lg rounded-b-3xl select-none"
        style={{
          background: "linear-gradient(to right, #f8f1e5, #e7ded3)",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <div className="text-gray-700 text-2xl font-semibold flex items-center">
            <FaChair size={24} className="mr-2" />
            <span className="font-serif">
              <Link to={"/"}>LuxSpaces</Link>
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Search for furniture..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-4 py-2 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-72"
              />
              <button className="bg-gray-600 text-white px-4 py-2 rounded-r-full hover:bg-gray-700 transition duration-300">
                <FaSearch size={24} />
              </button>
              {searchResults.length > 0 && (
                <ul
                  className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-10"
                  style={{ listStyleType: "none", padding: "0", margin: "0" }}
                >
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {login ? (
              <>
                <span>Hi, {user?.name||"user"} </span>
                <button
                  onClick={handleLogout}
                  className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300 shadow-md"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            )}
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaShoppingCart
                size={25}
                onClick={handleCarticon}
                className="text-gray-700 hover:text-gray-500 transition duration-300"
              />
            </div>
            <div className="text-gray-700 hover:text-gray-500 transition duration-300">
              <Link to="/myorders">My Orders</Link>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <FaHeart size={25} className="text-gray-700 hover:text-gray-500 transition duration-300" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
