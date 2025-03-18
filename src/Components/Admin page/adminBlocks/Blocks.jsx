import React, { useState, useEffect } from 'react';
import api from '../../../../Api/api';


const Blocks = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Fetch all blocked users
  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await api .get('/api/userBlocked');
      setBlockedUsers(response.data.data); // Assuming API returns an array of blocked users
    } catch (error) {
      console.error('Error fetching blocked users:', error.response?.data || error.message);
    }
  };

  // Handle Unblock User
  const handleUnblock = async (userId) => {
    try {
      const response = await api.post(`/api/user/:Blockid?UserId=${userId}`);

      if (response.status === 200) {
        fetchBlockedUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error.response?.data || error.message);
    }
    fetchBlockedUsers();
  };

  return (
    <div className="p-6 ml-64">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Blocked Users</h1>

      {blockedUsers.length > 0 ? (
        <div className="overflow-x-auto bg-gray-50 p-4 border border-gray-300 rounded-lg">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-500 text-white text-center">
                <th className="px-6 py-3 text-lg font-semibold border border-gray-300">User ID</th>
                <th className="px-6 py-3 text-lg font-semibold border border-gray-300">E-mail</th>
                <th className="px-6 py-3 text-lg font-semibold border border-gray-300">User Name</th>
                <th className="px-6 py-3 text-lg font-semibold border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blockedUsers.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-red-100 transition-colors duration-300">
                  <td className="px-6 py-4 text-gray-800 font-medium border border-gray-300">{user.id}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium border border-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium border border-gray-300">{user.name}</td>
                  <td className="px-6 py-4 text-center border border-gray-300">
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                    >
                      Unblock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg">No blocked users found.</p>
      )}
    </div>
  );
};

export default Blocks;
