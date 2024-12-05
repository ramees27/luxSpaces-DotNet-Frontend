import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data.slice(1)); // Assuming you're fetching all users
      });
  }, []);

  const handleBlockUser = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user, blocked: user.blocked === 'false' ? 'true' : 'false' };
        // Update blocked status in the database
        axios.put(`http://localhost:5000/users/${userId}`, updatedUser)
          .then(() => {
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
          });
        return updatedUser;
      }
      return user;
    }));
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6 ml-64 select-none">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 drop-shadow-md">
        Users Management
      </h1>

      <div className="overflow-x-auto rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center">
              <th className="px-6 py-3 text-lg font-semibold">User ID</th>
              <th className="px-6 py-3 text-lg font-semibold">E-mail</th>
              <th className="px-6 py-3 text-lg font-semibold">User Name</th>
              <th className="px-6 py-3 text-lg font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="bg-white hover:bg-blue-100 transition-all cursor-pointer"
                onClick={() => handleRowClick(user)}
              >
                <td className="px-6 py-4 text-gray-800 font-medium border-b">{user.id}</td>
                <td className="px-6 py-4 text-gray-800 font-medium border-b">{user.email}</td>
                <td className="px-6 py-4 text-gray-800 font-medium border-b">{user.name}</td>
                <td className="px-6 py-4 text-center border-b">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal from opening
                      handleBlockUser(user.id);
                    }}
                    className={`bg-${user.blocked === 'true' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded-md`}
                  >
                    {user.blocked === 'true' ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to show user details and order history */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <div className="mb-4">
              <strong>ID:</strong> {selectedUser.id}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="mb-4">
              <strong>Name:</strong> {selectedUser.name}
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-4">Order History</h3>
            {selectedUser.orders && selectedUser.orders.length > 0 ? (
              selectedUser.orders.map((order, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-lg font-semibold">Order ID: {order.order}</h4>
                  <p className="text-sm text-gray-600">Date: {order.date}</p>
                  <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                  
                  <div className="mt-4 b-bo border-b-4 ">
                    <h5 className="font-semibold">Products:</h5>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-center mb-4 ">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm">Category: {item.category}</p>
                            <p className="text-sm">Price: ₹{item.price}</p>
                            <p className="text-sm">Quantity: {item.quantity}</p>
                            
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found for this user.</p>
            )}

            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
