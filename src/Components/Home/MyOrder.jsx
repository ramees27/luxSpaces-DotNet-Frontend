
import React, {  useEffect, useState } from "react";
// import { userContext } from "../Context/Context";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../Api/api";

const MyOrder = () => {
  const [orders, setOrders] = useState ([]);
  const navigate = useNavigate();
  // const token = useSelector((state) => state.auth.token); // Get authentication token

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api .get("/api/Order/get-orderDetails")
        console.log(response)

        if (response.data.statusCode === 200||[]) {
          setOrders(response.data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        
      }
    };

    fetchOrders();
    }, []);

    return (
      <div className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
            Your Orders
          </h2>
  
          {orders.length === 0 ? (
            <p className="text-center text-lg text-gray-600 py-10">
              You have no orders yet.
            </p>
          ) : (
            <div className="space-y-8">
              {orders.slice().reverse().map((order, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-stone-900"
                >
                  {/* Order Details */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      <span className="text-white">Order ID:</span> {order.orderId}
                    </h3>
                    <p className="text-sm text-white">
                      Placed on: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-white">
                      Total Price: ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-white">
                      Transaction ID: {order.transactionId}
                    </p>
                  </div>
  
                  {/* Address Details */}
                  <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-white font-semibold">Delivery Address</h4>
                    <p className="text-gray-300">{order.address.street}, {order.address.city}</p>
                    <p className="text-gray-300">{order.address.state} - {order.address.postalCode}</p>
                    <p className="text-gray-300">Phone: {order.address.number}</p>
                  </div>
  
                  {/* Ordered Items */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200"
                      >
                        <img
                          src={item.img}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                        />
  
                        <div className="ml-4 flex flex-col">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {item.productName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
  
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 bg-stone-800 text-white font-medium text-lg rounded-lg hover:bg-stone-900 transition duration-300"
            >
              <FaHome className="mr-2" size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default MyOrder;