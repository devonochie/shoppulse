import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Product = () => {
  // const id = '67370fb5058581b3d119daef'
  const { id } = useParams();
  const {addToCart} = useCart()
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/product/${id}`); 
        // console.log(response.data?._id)
        // if (!response.ok) throw new Error('Failed to fetch product');
        const data = response.data
        console.log(data)
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


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

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.title || "Product Title"}</h1>
      <img
        src={`http://localhost:3001/${product.photo || "default.jpg"}`}
        alt={product.title || "Product Image"}
        className="product-images"
        /*style={{ width: '400px', height: '400px', objectFit: 'cover' }}*/
      />
      <p>{product.description || "No description available."}</p>
      <p>Price: ${product.price || "N/A"}</p>
       <button onClick={() => handleAddToCart(product._id, 1)}>Add to Cart</button>
    </div>
  );
};

export default Product;
