// import axios from 'axios';
// import React, { createContext, useEffect, useState } from 'react';

// export const productContex = createContext();

// const AdminContext = ({ children }) => {
//   const [adminProduct, setAdminProduct] = useState([]);

 
//   useEffect(() => {
//     axios.get("http://localhost:5000/products")
//       .then((response) => {
//         setAdminProduct(response.data);
//       });
//   }, []);

 


//   const editProduct = (updatedProduct) => {
//     axios.put(`http://localhost:5000/products/${updatedProduct.id}`, updatedProduct)
//       .then(() => {
//         setAdminProduct((prevProducts) =>
//           prevProducts.map((product) =>
//             product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
//           )
//         );
//       });
//   };

  

  
//   return (
//     <productContex.Provider value={{ adminProduct, setAdminProduct, editProduct }}>
//       {children}
//     </productContex.Provider>
//   );
// };

// export default AdminContext;
import React from 'react'

const AdminContext = () => {
  return (
    <div>AdminContext</div>
  )
}

export default AdminContext