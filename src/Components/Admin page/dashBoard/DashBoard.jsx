import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const DashBoard = () => {
  const [stats, setStats] = useState({
    sale: 0,
    product: 0,
    users: 0,
    stocks: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((response) => {
        const userCount = response.data.length;
        setStats((prevStats) => ({ ...prevStats, users: userCount }));
      });

    
    axios.get('http://localhost:5000/users')
      .then((response) => {
        const users = response.data;
        const totalSales = users.reduce((total, user) => {
          const userSales = user.orders.reduce((orderTotal, order) => orderTotal + order.total, 0);
          return total + userSales;
        }, 0);
        setStats((prevStats) => ({ ...prevStats, sale: totalSales }));
      });

    
    axios.get('http://localhost:5000/products')
      .then((response) => {
        const productCount = response.data.length;
        setStats((prevStats) => ({ ...prevStats, product: productCount }));
      });

    
    axios.get('http://localhost:5000/products')
      .then((response) => {
        const stockCount = response.data.reduce((total, product) => total + product.stock, 0);
      
        setStats((prevStats) => ({ ...prevStats, stocks: stockCount }));
      });
  }, []);

  return (
    <div className="ml-64 p-6 select-none">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-800 drop-shadow-md">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-4xl font-bold text-white">Total Sales</h3>
          <p className="text-3xl text-white">₹{stats.sale}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-4xl font-bold text-white">Total Users</h3>
          <p className="text-3xl text-white">{stats.users}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-4xl font-bold text-white">Products Count</h3>
          <p className="text-3xl text-white">{stats.product}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <h3 className="text-4xl font-bold text-white">Stocks Count</h3>
          <p className="text-3xl text-white">{stats.stocks}</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
