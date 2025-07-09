import React from 'react';
import {  useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';



const ProductList = () => {
  const { data: products, isLoading, error } = useProducts();
  const { addToCart } = useCart()
  

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products. Please try again later.</div>;

  const handleAddToCart = async (product_id, quantity) => {
    const user_id = localStorage.getItem('user_id')
    try {
        const response = await addToCart(user_id, product_id, quantity);
        console.log(response.data.cart)
        alert(response.data.message);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};



  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <Link to={`/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <img
              src={`http://localhost:3001/${product.photo}`}
              alt={product.title}
              className="product-image"
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
            <p>Price: ${product.price}</p>
          </Link>
          <button onClick={() => handleAddToCart(product._id, 1)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
