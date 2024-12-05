import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blocks = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    // Fetch user data
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = () => {
    axios.get('http://localhost:5000/users')
      .then((response) => {
        // Filter users with `blocked: "true"`
        const blocked = response.data.filter(user => user.blocked === 'true');
        setBlockedUsers(blocked);
      });
  };

  const handleUnblock = (userId) => {
    // Update the user's `blocked` status
    axios.patch(`http://localhost:5000/users/${userId}`, { blocked: 'false' })
      .then(() => {
        // Remove the unblocked user from the list
        setBlockedUsers(prevBlockedUsers => prevBlockedUsers.filter(user => user.id !== userId));
      })
      .catch((error) => {
        console.error('Error unblocking the user:', error);
      });
  };

  return (
    <div className="p-6 ml-64">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Blocked Users
      </h1>

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
              {blockedUsers.map(user => (
                <tr
                  key={user.id}
                  className="bg-white hover:bg-red-100 transition-colors duration-300"
                >
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
