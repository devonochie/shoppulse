import axios from 'axios'
import React, { createContext, useContext} from 'react'

const BKEP = 'http://localhost:3001/api/cart'
const CartContext = createContext()



const CartProvider = ({children}) => {

  const getCart = async (user_id, page = 1) => {
    try {
      const response = await axios.get(`${BKEP}/${user_id}?page=${page}`);
      return response.data; // Return the cart data
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  };
  

  const addToCart = async (user_id, product_id, quantity) => {
    return await axios.post(`${BKEP}/add`, {
      user_id: user_id, 
      product_id: product_id,
      quantity
    })
  }

  const removeFromCart = async (user_id, product_id) => {
     return await axios.delete(`${BKEP}/remove`, {
      params: {
        user_id: user_id,
        product_id: product_id
      }
    })
  }

  const updateCart = async (user_id, product_id, quantity) => {
    try {
      const response = await axios.put(`${BKEP}/update`, {
        user_id,
        product_id,
        quantity,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error updating the cart:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update cart');
    }
  };
  

  const clearCart = async (user_id) => {
    return  await axios.delete(`${BKEP}/clear`,{
      data: {user_id: user_id}
    }

    )
    
  }

 


  const values = {
     
    getCart,
    addToCart,
    removeFromCart,
    updateCart,
    clearCart

  }
  return (
   <CartContext.Provider value={values}>{children}</CartContext.Provider>
  )
}

const useCart = () => useContext(CartContext)

export { useCart, CartProvider}
