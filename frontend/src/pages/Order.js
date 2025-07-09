import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const { getOrder, updateOrder } = useOrder();
  const [loading, setLoading] = useState(false);

  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrder(user_id);
      console.log(response.order);
      setOrders(response.order|| []); // Safely set orders
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (order_id, status) => {
    const response = await updateOrder(order_id, status)
    setOrders(response.order)
  }

  if (loading) {
    return <p>Loading.....</p>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <h2>Order ID: {order._id}</h2>
            <p>Status: {order.status}</p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
            <h3>Items:</h3>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  Product ID: {item.product_id} | Quantity: {item.quantity}
                </li>
              ))}
            </ul>
            <input type="text" style={{width: '100px', background:'green', color: 'white'}} value={order.status} onChange={() => handleUpdateOrder(order._id, order.status)} />
          </div>
        ))
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Order;
