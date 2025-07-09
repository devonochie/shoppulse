import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BKEP='http://localhost:3001'

const fetchProducts = async () => {
  const { data } = await axios.get(`${BKEP}/api/product`);
  return data;
};


export const getProduct = async (product_id) => {
  try {
    const response = await axios.get(`${BKEP}/api/product/${product_id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const useProducts = () => {
  return useQuery({
    queryKey: ['product'],
    queryFn: fetchProducts,
  });
};