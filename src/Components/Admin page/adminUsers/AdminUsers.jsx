import React, { useState, useEffect } from "react";
import api from "../../../../Api/api";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    // handleBlockUnblockUser(userId)
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/get-all");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  // Fetch user's order history
  const fetchUserOrders = async (userId) => {
    try {
      const response = await api.get(`/api/Order/get-orderDetailsById?userId=${userId}`);
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching user orders:", error.response?.data || error.message);
      return [];
    }
  };

  // Handle row click to open modal
  const handleRowClick = async (user) => {
    const userOrders = await fetchUserOrders(user.id);
    setSelectedUser({ ...user, orders: userOrders });
    setIsModalOpen(true);
  };

  // Close modal function
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle Block/Unblock User
  const handleBlockUnblockUser = async (userId) => {
    try {
      const response = await api.post(`/api/user/:Blockid?UserId=${userId}`);

      if (response.status === 200) {
        // Assuming backend returns updated block status
        const updatedStatus = response.data.isBlocked; // `true` or `false`
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isBlocked: updatedStatus } : user
          )
        );
        toast.success("User Blocked Succusfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error.response?.data || error.message);
    }
    fetchUsers();
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
            {users.map((user) => (
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
                      e.stopPropagation(); // Prevent modal from opening when clicking button
                      handleBlockUnblockUser(user.id);
                    }}
                    className={`px-4 py-2 rounded-md text-white ${
                      user.isBlocked ? "bg-green-500 hover:bg-green-700" : "bg-red-500 hover:bg-red-700"
                    }`}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for User Details and Order History */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2 max-h-[80vh] flex flex-col shadow-lg">
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-grow p-2">
              <h2 className="text-2xl font-bold mb-4">User Details</h2>

              <div className="mb-4"><strong>ID:</strong> {selectedUser.id}</div>
              <div className="mb-4"><strong>Name:</strong> {selectedUser.name}</div>
              <div className="mb-4"><strong>Email:</strong> {selectedUser.email}</div>

              {/* Order History */}
              <h3 className="text-xl font-semibold mt-6 mb-4">Order History</h3>
              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                selectedUser.orders.map((order, index) => (
                  <div key={index} className="mb-6 p-4 border rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold">Order ID: {order.orderId}</h4>
                    <p className="text-sm text-gray-600">Date: {order.orderDate}</p>
                    <p className="text-sm text-gray-600">Total: ₹{order.totalAmount}</p>

                    {/* Products in the Order */}
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-semibold">Products:</h5>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex items-center mb-4">
                            <img src={item.img} alt={item.productName} className="w-16 h-16 object-cover mr-4 rounded" />
                            <div>
                              <p className="font-semibold">{item.productName}</p>
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
            </div>

            {/* Fixed Close Button */}
            <div className="border-t p-4 bg-white">
              <button
                onClick={handleCloseModal}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
