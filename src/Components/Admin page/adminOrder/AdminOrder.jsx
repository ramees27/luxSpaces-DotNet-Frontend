import React, { useState, useEffect } from "react";
import api from "../../../../Api/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/Order/get-order");
      setOrders(response.data.data); 
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  
    return (
      <div className="flex">
        
        <div className="flex-1 ml-64 p-6"> 
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Total Order History</h1>
          
          <div className="overflow-auto max-h-[80vh] pr-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order.orderId} className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
          
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">Order ID:</h2>
                      <p className="text-gray-600">{order.orderId}</p>
                    </div>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      ₹ {order.totalAmount}
                    </span>
                  </div>
  
              
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">
                      <strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Transaction ID:</strong> {order.transactionId}
                    </p>
                  </div>
  
                
                  <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <h3 className="text-gray-800 font-semibold">Shipping Address</h3>
                    <p className="text-gray-600 text-sm">{order.address.name}</p>
                    <p className="text-gray-600 text-sm">{order.address.street}, {order.address.city}</p>
                    <p className="text-gray-600 text-sm">{order.address.state} - {order.address.postalCode}</p>
                  </div>
  
                
                  <h3 className="text-gray-800 font-semibold mb-2">Ordered Items</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <div key={item.orderItemId} className="flex bg-gray-50 p-4 rounded-lg border">
                        <img src={item.img} alt={item.productName} className="w-20 h-20 rounded-md object-cover" />
                        <div className="ml-4">
                          <h4 className="text-gray-800 font-medium">{item.productName}</h4>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                          <p className="text-gray-600 text-sm">₹ {item.price} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
  );
};

export default AdminOrders;
