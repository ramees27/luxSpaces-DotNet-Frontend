import { Navigate, useLocation, useNavigate } from "react-router-dom";
import React,{useContext} from "react";
import { userContext } from "../Context/Context";

const Order = () => {
  
  
  const { confirmOrder,totalAmount } = useContext(userContext); 
  
  
  const navigate= useNavigate();

  return (
    <div
      className="bg-gray-100 min-h-screen p-6 flex justify-center items-center select-none"
      style={{ objectFit: "contain" }}
    >
      <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg">
       
        <form className="w-2/3 bg-stone-500 p-6 rounded-l-lg" onSubmit={e => {
          e.preventDefault();
          confirmOrder(); 
        }}>
          <h1 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-stone-500 to-stone-700 px-4 py-2 rounded-lg shadow-md">
            Place Your Order
          </h1>

          
          <h5 className="text-xl font-semibold text-gray-900 mb-4">
            Address Details
          </h5>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
            
            <input
              type="text"
              placeholder="Phone Number"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              placeholder="Street Address"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              placeholder="State"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
            <input
              type="text"
              placeholder="Postal Code"
              required
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2"
            />
          </div>

          
          <h5 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
            Payment Details
          </h5>
          <div className="grid gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="payment"
                value="COD"
                className="mr-2"
                required
              />
              <label htmlFor="cod" className="text-gray-900">
                PayPal
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="card"
                name="payment"
                value="Card"
                className="mr-2"
                required
              />
              <label htmlFor="card" className="text-gray-900">
                Credit/Debit Card
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-stone-800 text-white font-semibold py-2 rounded-md shadow hover:bg-stone-900 transition duration-200"
          >
            Confirm Order
          </button>
        </form>

        
        <div className="w-1/3 bg-stone-700 text-white p-6 rounded-r-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="text-lg font-semibold mb-4">
            Total Price: ₹{totalAmount()}
          </div>
          
          <button
            onClick={()=>navigate("/cart")} 
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-md shadow hover:bg-red-600 transition duration-200"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
