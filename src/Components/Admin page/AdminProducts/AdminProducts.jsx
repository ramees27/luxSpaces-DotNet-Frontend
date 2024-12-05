import React, { useState, useContext } from 'react';
import { productContex } from '../adminUsers/AdminContext/AdminContext';
import axios from 'axios';

const AdminProducts = () => {
  const { adminProduct, setAdminProduct, editProduct } = useContext(productContex);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');


// delete
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/products/${id}`).then(() => {
      setAdminProduct((prevProducts) => prevProducts.filter((product) => product.id !== id));
    });
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      image: '',
    });
    setIsModalOpen(true);
    setIsAdding(true);
  };

  const handleSave = () => {
    if (isAdding) {
      axios.post('http://localhost:5000/products', currentProduct).then((response) => {
        setAdminProduct((prevProducts) => [...prevProducts, response.data]);
        setIsModalOpen(false);
      });
    } else {
      editProduct(currentProduct);
      setIsModalOpen(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? adminProduct
      : adminProduct.filter((product) => product.category === selectedCategory);

  return (
    <div className="p-6 ml-64 select-none">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="category" className="text-gray-700 font-bold">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="All">All</option>
            <option value="Living">Living</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Office Furniture">Office Furniture</option>
            <option value="Dining">Dining</option>
            <option value="Kitchen">Kitchen</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-50 p-4">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain"
                  />
                </td>
                <td className="px-4 py-3">{product.description}</td>
                <td className="px-4 py-3 flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing or Adding */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-2xl font-bold mb-4">
              {isAdding ? 'Add New Product' : 'Edit Product'}
            </h2>
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <label className="block mb-2">Category:</label>
            <input
              type="text"
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <label className="block mb-2">Stock:</label>
            <input
              type="number"
              value={currentProduct.stock}
              onChange={(e) => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <label className="block mb-2">Description:</label>
            <textarea
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <label className="block mb-2">Image URL:</label>
            <input
              type="text"
              value={currentProduct.image}
              onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
              className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
