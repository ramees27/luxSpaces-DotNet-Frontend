import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link ,useNavigate, useLocation} from 'react-router-dom';
import { userContext } from '../Context/Context';
import axios from 'axios';

const Details = () => {
   
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0); 
    }, [pathname]);


const{addToCart} = useContext(userContext)
  const { furnitureId } = useParams(); 
  const [product, setProduct] = useState({}); 
 
 
  useEffect(() => {
    axios.get(`http://localhost:5000/products/${furnitureId}`)
    .then((response) => {
      setProduct(response.data); 
    });
  }, [furnitureId]);



  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6 select-none">
      <div className="max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105">
        <div className="p-8 flex flex-col lg:flex-row items-center lg:items-start">
          <img
            src={product.image}
            alt={product.name}
            style={{ objectFit: "contain" }}
            className="w-full lg:w-1/2 h-80 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-110"
          />
          <div className="lg:ml-10 mt-6 lg:mt-0 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-700 mb-2">
              <strong>Price:</strong> ₹ {product.price} <span className="line-through text-red-500">₹{product.oldprice}</span>
            </p>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Description:</strong> {product.description}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Category:</strong> {product.category}
            </p>
          </div>
        </div>

      
        <div className="p-6 flex justify-center">
          <button onClick={() => addToCart(product)} className="bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-full hover:bg-green-600 focus:outline-none transition-all duration-300 transform hover:scale-105">
            Add to Cart
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Details;
