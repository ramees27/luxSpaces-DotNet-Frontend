import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../../../Api/api";
import { FaHome } from "react-icons/fa";

const Order = () => {
  const navigate = useNavigate();
  

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const totalAmount = useSelector((state) => state.app.totalAmount);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      number: parseInt(formData.number, 10) || 0, 
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postalCode: parseInt(formData.postalCode, 10) || 0, 
    };
    

    try {
      const response = await api.post("/api/Address/add-Address", formData);
    
     
        toast.success("Address Added", {
          position: "top-center",
          autoClose: 2000,
        });
       
      
     
    } catch (error) {
      console.error("Failed to Add Address", error);
      toast.error( "You can only add up to 3 addresses.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    navigate("/Address");
  }    

  return (
    <div className="bg-gradient-to-r from-gray-200 to-gray-100 min-h-screen p-6 flex justify-center items-center">
      <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">

        <form
          className="w-2/3 bg-gradient-to-r from-gray-700 to-gray-400 p-8 text-white rounded-l-2xl"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold mb-6">📍 Add New Address</h1>

        
          <div className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="number"
              placeholder="Phone Number"
              value={formData.number}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="street"
              placeholder="Street Address"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

        
          <button
            type="submit"
            className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
          >
            Continue
          </button>
        </form>

        
        <div className="w-1/3 bg-gray-100 p-8 flex flex-col justify-between items-center rounded-r-2xl">
          <h2 className="text-2xl font-bold text-gray-800">🏡 Address Details</h2>
          <p className="text-gray-600 text-center">
            Ensure your address is correct before proceeding.
          </p>

        
          <button
            onClick={() => navigate("/address")}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 
                       rounded-lg shadow-md hover:bg-blue-700 hover:shadow-xl 
                       transition duration-300 transform hover:scale-105 active:scale-95"
          >
            <FaHome className="text-lg" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
