import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BKEP = 'http://localhost:3001/api/product';

const Home = () => {
  const [term, setTerm] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null);
      setResult([]);

      const response = await axios.get(`${BKEP}/search?term=${term}`);
      console.log(response.data.product);

      if (response.data.product.length > 0) {
        setResult(response.data.product);
      } else {
        setResult([]);
        setError('No products found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong. Please try again.');
      setResult([]);
    }
  };

  return (
    <div>
      <header>
        <h1>Search Product</h1>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter search term"
          style={{width: '200px'}}
        />
        <button onClick={handleSearch}>Search</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {result.length > 0 && (
          <div>
            <h2>Search Results</h2>
            {result.map((product) => (
              <div key={product._id} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', width: "500px" }}>
                <Link to={`/${product._id}`}>
                    <img
                      src={`http://localhost:3001/${product.photo}`}
                      alt={product.title}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ${product.price.toFixed(2)}</p>
                </Link> 
              </div>
            ))}
          </div>
        )}

        <h1>Welcome to Our E-commerce Platform</h1>
        <p>Discover our exclusive products below</p>
      </header>

      <ProductList />

      <footer>
        <p>&copy; 2024 Our Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
