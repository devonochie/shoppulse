import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import {useNavigate} from 'react-router-dom'
import { useOrder } from '../context/OrderContext';

const Cart = () => {
  const {getCart,  clearCart, updateCart, removeFromCart } = useCart()
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const {createOrder} = useOrder()
  const navigate = useNavigate()
  
  const user_id = localStorage.getItem('user_id')



  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCart(user_id, page);
      console.log(response.cart);
      setCart(response.cart || {}); // Set the cart data
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart({})
      setPage(1)
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> {
    fetchCart()
  }, [page])
  
  const handleUpdateCart = async (product_id, quantity) => {
    // Check if quantity is valid
    if (quantity < 0) return;
  
    try {
      // Optimistically update the cart locally
      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.product_id._id === product_id) {
            return { ...item, quantity };
          }
          return item;
        });
  
        return { ...prevCart, items: updatedItems };
      });
  
      // Send the update request to the backend
      const response = await updateCart(user_id, product_id, quantity);
  
      // Optionally sync with server response (if needed)
      if (response.cart) {
        setCart(response.cart);
      }
      alert("Cart updated successfully!");
      fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
      // Optionally, revert the optimistic update in case of failure
      
    }
  };

  const handleRemoveCart =  async ( product_id) => {
    const response = await removeFromCart(user_id, product_id)
    alert('Item in cart deleted succesfully', response.cart)
    setCart(response.cart)
    fetchCart()
  }

  const handleClearCart = async () => {
    try {
        const response = await clearCart(user_id);
        alert('Cart cleared Successfully', response.cart);
        navigate('/products')
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
};

const handleOrder = async (items, total) => {
  const response = await createOrder(user_id, items, total)
  alert('Order created successfully', response.order)
  navigate('/order')
  
}

  if (loading) return <div>Loading cart...</div>;

  return (
    <div className="cart-container">
  <h1>Your Cart</h1>
  {cart?.items?.length > 0 ? (
    <div>
      <ul>
        {cart.items.map((item) => (
          <li className="cart-item" key={item._id}>
            <img src={`http://localhost:3001/${item.product_id.photo}`} alt={item.product_id.title} />
            <div className="cart-item-details">
              <h3>{item.product_id.title}</h3>
              <p>{item.product_id.description}</p>
              <p>Price: ${item.product_id.price}</p>
              <p>Subtotal: ${(item.product_id.price * item.quantity).toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
              <button
                onClick={() =>
                  handleUpdateCart(item.product_id._id, Math.max(item.quantity - 1, 0))
                }
                disabled={item.quantity === 0}
              >
                -
              </button>
              <input type="text" value={item.quantity} readOnly />
              <button
                onClick={() => handleUpdateCart(item.product_id._id, item.quantity + 1)}
              >
                +
              </button>
              <button onClick={() => handleRemoveCart(item.product_id._id)}> Delete</button>
            </div>

          </li>
        ))}
      </ul>
      <div className="cart-total">Total Price: ${cart.totalPrice.toFixed(2)}</div>
      <div className="pagination">
        <button disabled={cart.Currentpage === 1} onClick={() => fetchCart(cart.Currentpage - 1)}>Previous</button>
        <button onClick={() => fetchCart(cart.Currentpage + 1)}>Next</button>
      </div>
      <button onClick={ handleClearCart}>Clear Cart</button>
      <button onClick={() => handleOrder(cart.items, cart.totalPrice.toFixed(2))} style={{justifyContent: 'right'}}>Create Order</button>
      
    </div>
  ) : (
    <p>Your cart is empty.</p>
  )}
  

</div>

  );
};

export default Cart;
