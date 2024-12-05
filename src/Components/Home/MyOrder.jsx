
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/Context";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
 
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("id");

    const fetchOrders = async () => {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const updatedOrders = response.data.orders.map((order) => ({
        ...order,
        orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      }));
      setOrders(updatedOrders);
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
     <div className="space-y-8 ">
      {orders.map((order, index) => (
       <div
           key={index}
           className=" p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 bg-stone-900"
              >
          
           <div className="mb-4 ">
           <h3 className="text-lg font-semibold text-white">
            <span className="text-white">Order ID:</span>{" "}
            {order.orderId}
                  </h3>
            <p className="text-sm text-white">
             Placed on: {new Date(order.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-white">
              Total Price: ₹{order.total}
             </p>
             </div>

             
             <div className="space-y-4">
             {order.items.map((item, idx) => (
             <div
               key={idx}
               className="flex items-centre bg-gray-50 p-4 rounded-lg border border-gray-200"  >
               <img
                    src={item.image}
                    alt={item.name}
                     className="w-20 h-20 object-cover rounded-lg border border-gray-300"/>

                     
                  <div className="ml-4 flex flex-col">
                   <h4 className="text-lg font-semibold text-gray-900">
                   {item.name}
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

