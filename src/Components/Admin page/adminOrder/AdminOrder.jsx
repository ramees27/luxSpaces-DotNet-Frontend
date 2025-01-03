import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [users, setUsers] = useState([]);

  // Fetch data from API
  useEffect(() => {
    axios.get('http://localhost:5000/users') 
      .then((response) => {
        setUsers(response.data); 
      });
  }, []); 

  return (
    <div className="p-6 select-none" style={{ marginLeft: '250px' }}> 
      {/* Add left margin to accommodate the sidebar */}
      <h1 className="text-3xl font-semibold mb-6">Latest Orders</h1>

      <div className="grid grid-cols-1 gap-6">
        {users
          .filter(user => user.orders && user.orders.length > 0) 
          .map((user) => (
            user.orders 
              .slice().reverse().map((order, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Order #{order.order}
                  </h3>
                  <p className="text-gray-500 mb-2">
                    <strong>User:</strong> {user.name} ({user.email})
                  </p>
                  <p className="text-gray-500 mb-4">
                    <strong>Date:</strong> {order.date}
                  </p>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-700">Items</h4>
                    <ul className="space-y-4">
                      {order.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-gray-500">Price:₹ {item.price}</p>
                              <p className="text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold text-lg text-blue-600">Total:₹{order.total}</p>
                  </div>
                </div>
              ))
          ))}
      </div>
    </div>
  );
  
};

export default AdminOrders;
