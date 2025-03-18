import axios from 'axios';
import React, { useState, useEffect } from 'react';
import api from '../../../../Api/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../Redux/AdminSlice';

const DashBoard = () => {
  const dispatch = useDispatch ();
  const { products, loading, error } = useSelector((state) => state.admin);
  const [stats, setStats] = useState({
    sale: 0,
    product: 0,
    users: 0,
    stocks: 0,
  });
  useEffect(() => {
    dispatch(fetchProducts ()); // Fetch products from API via Redux
    // Fetch categories if needed
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      setStats((prev) => ({
        ...prev,
        product: products.length, // ✅ Total Product Count
        stocks: products.reduce((total, product) => total + (product.stock || 0), 0), // ✅ Total Stock Count
      }));
    }
  }, [products]);
  
  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/get-all");
      setStats(prev => ({ ...prev, users: response.data.data }));
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    // Fetch total sale amount
    const fetchTotalSales = async () => {
      try {
        const response = await api.get("/api/Order/TotalSale");
        setStats(prev => ({ ...prev, sale: response.data.data })); // ✅ Update only the sale field
      } catch (error) {
        console.error("Error fetching total sales:", error);
      }
    };

    fetchTotalSales();
    fetchUsers();
     
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
          <p className="text-3xl text-white">{stats.users.length}</p>
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

