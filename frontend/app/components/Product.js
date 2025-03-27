"use client";

import React, { useEffect, useState } from 'react';
import AddToCart from './AddToCart';

const ProductGrid = ({ isLoggedIn, setShowLogin }) => {
  const [products, setProducts] = useState([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products", {
            method: "GET"
        });
        if (response.ok) {
            const data = await response.json();
            setProducts(data);
        } 
        else {
            console.error("Failed to fetch products");
        }
      } 
      catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleButtonClick = (product) => {
    if (isLoggedIn){
      setSelectedProduct(product)
      setShowAddToCart(true);
    }
    else{
      setShowLogin(true)
    }
  };

  const closeAdd = () => {
    setShowAddToCart(false)
  };

  if (!products) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // Change this line to change number of columns
    gap: '20px',
    padding: '20px',
    width: '80%',
    margin: '0 auto', 
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: 'white',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    objectFit: 'cover',
  };

  return (
    <div style={gridStyle}>
      {products.map((product, index) => (
        <div className="product-card" key={index} style={cardStyle}>
          <h3>{product.productName}</h3>
          <p>${product.price}</p>
          <img
            src={`data:image/jpeg;base64,${product.image}`}
            alt={product.productName}
            className="product-image"
          />
          <button className="mx-1 font-semibold px-4 py-2 inline-block whitespace-nowrap rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer mt-auto"
          onClick={() => handleButtonClick(product)}
          >
          Add to Cart
          </button>

          {showAddToCart && (
            <AddToCart
              product={selectedProduct}
              onClose={closeAdd}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;