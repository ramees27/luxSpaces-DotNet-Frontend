import React from 'react';
import Product from './Product';

const Home = () => {
  
  return (
    <div>
     
      <div 
        className="relative w-full h-auto sm:h-64 md:h-80 lg:h-96 mt-16 flex justify-center items-center select-none"
        style={{ perspective: "1000px" }} 
      >
        <img 
          src="https://m.media-amazon.com/images/I/81JTSit9U+L._SL1500_.jpg"
          alt="Furniture Cover"
          className="w-full h-full object-cover rounded-3xl shadow-lg transform transition-transform duration-500 hover:rotate-x-6 hover:rotate-y-6"
          style={{
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
            transformStyle: "preserve-3d",
            objectFit:"cover"
            
          }}
        />
      </div>
      <Product />
    </div>
  );
};

export default Home;

