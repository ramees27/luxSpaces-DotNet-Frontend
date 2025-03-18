import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../Redux/AdminSlice";
import api from "../../../../Api/api";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategory] = useState("Select Category")
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [categoriesDisplay, setCategoriesDisplay] = useState([]);
  const [IsCategoryModalOpen,setIsCategoryModalOpen]=useState(false)

  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchProducts());
    CategoryGet()
  }, [dispatch]);


  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  
  const handleAdd = () => {
    setCurrentProduct({
      Name: "",
      Price: "",
      Stock: "",
      Description: "",
      Img: null,
      OldPrice: "",
      categoryId: "",
    });
    setIsModalOpen(true);
    setIsAdding(true);
  };





  const CategoryGet = async () => {
    try {
      const responce = await api.get("/api/Products/Category-Get")
      setCategory(responce.data.data)
      console.log(setCategory)
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }


  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    setCurrentProduct((prev) => ({
      ...prev,
      categoryId: selectedId,
    }));
  };




  
  const handleSave = async () => {
    if (!currentProduct.Name || !currentProduct.Description || !currentProduct.Img) {
      alert("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", currentProduct.Name.trim());
    formData.append("Description", currentProduct.Description.trim());
    formData.append("CategoryId", currentProduct.categoryId);
    formData.append("Price", currentProduct.Price);
    formData.append("OldPrice", currentProduct.OldPrice || 0);
    formData.append("Stock", currentProduct.Stock);
    if (currentProduct.Img) {
      formData.append("Img", currentProduct.Img);
    }


    try {
      if (isAdding) {
        await api.post("/api/Products/Add-NewProduct", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {

        await api.put(`/api/Products/update-product?productId=${currentProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsModalOpen(false);
      dispatch(fetchProducts());
      toast.success("Product Added or edited", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error saving product:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);

      }
      console.log(error)
    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value === "" ? "" : Number(value), 
    }));
  };

  const fetchCategories = async () => {
    try {
      const responce = await api.get("/api/Products/Category-Get")
      setCategoriesDisplay(responce.data.data)
      console.log(setCategory)
    }
    catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

 

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);


  const handleImageUpload = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setCurrentProduct((prev) => ({
        ...prev,
        Img: file, 
      }));
    }
  };


  const handleEdit = async (productId) => {
    try {
      const response = await api.get(`/api/Products/productId?id=${productId}`); 

      setCurrentProduct({
        id: response.data.data.id,
        Name: response.data.data.name || "",
        Description: response.data.data.description || "",
        categoryId: response.data.data.categoryId || "",
        Price: response.data.data.price || 0,
        OldPrice: response.data.data.oldPrice || 0,
        Stock: response.data.data.stock || 0,
        Img: response.data.data.img || null,

      });
      console.log(response)
      setIsAdding(false);
      setIsModalOpen(true);

    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };



  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      await api.post("/api/Products/Category-add", { categoryName: newCategory });
      CategoryGet(); 
      setIsAddingNewCategory(false)
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error.response?.data || error.message);
    }
  };


  useEffect(() => {
    fetchCategories();
   }, [handleAddCategory]);
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
            {categoriesDisplay.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
                    <img src={product.imgUrl} alt={product.name} className="w-16 h-16 object-contain" />
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product.id)}
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
      )}

  

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">{isAdding ? "Add Product" : "Edit Product"}</h2>

            
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={currentProduct.Name || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, Name: e.target.value })}

              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

          
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={currentProduct.Description || ""}
              onChange={(e) => setCurrentProduct({ ...currentProduct, Description: e.target.value })}

              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

            
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="categoryId"
              value={currentProduct.categoryId || ""}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setIsAddingNewCategory(true);
                } else {
                  handleCategoryChange(e);
                  setIsAddingNewCategory(false);
                }
              }}
              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
              <option value="new">➕ Add New Category</option>
            </select>

            {isAddingNewCategory && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border p-2 flex-1 rounded"
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-blue-500 px-4 py-2 rounded text-white"
                >
                  Add
                </button>
              </div>
            )}

            
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              type="number"
              name="Price"
              value={currentProduct.Price || ""}
              onChange={handleInputChange}

              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

           
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
            <input
              type="number"
              name="OldPrice"
              value={currentProduct.OldPrice || ""}
              onChange={handleInputChange}

              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

          
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="Stock"
              value={currentProduct.Stock || ""}
              onChange={handleInputChange}

              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

           
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input
              type="file"
              name="Img"
              onChange={handleImageUpload}
              className="border p-2 w-full mb-3 rounded focus:ring focus:ring-blue-300"
            />

          
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
