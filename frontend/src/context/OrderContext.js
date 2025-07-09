import axios from 'axios'
import React, { createContext, useContext } from 'react'


const OrderContext = createContext()

const BKEP = 'http://localhost:3001/api/order'

const  OrderProvider = ({children}) => {

   const getOrder = async (user_id) => {
      try {
        const response = await axios.get(`${BKEP}/${user_id}`);
        return response.data; // Return the cart data
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error; // Re-throw the error to handle it in the calling component
      }
    };
    
  
    const createOrder = async (user_id,items, total) => {
      return await axios.post(`${BKEP}/create/${user_id}`, {
        user_id: user_id, 
        items,
        total
      })
    }
    
    const updateOrder = async (order_id, status) => {
      try {
        const response = await axios.put(`${BKEP}/status`, {
         order_id,
         status
        });
    
        return response.data;
      } catch (error) {
        console.error('Error updating the cart:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update cart');
      }
    };
    
  


   const values = {
      updateOrder,
      createOrder,
      getOrder

   }
  return (
   < OrderContext.Provider value={values}>{children}</OrderContext.Provider>
  )
}

const useOrder = () => useContext(OrderContext)

export { OrderProvider, useOrder}
