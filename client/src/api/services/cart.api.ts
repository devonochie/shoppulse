import { CartItem } from '@/types/cart.type';
import axiosInstance from '../axios';


const getCart = async (): Promise<CartItem[]> => {
    const response = await axiosInstance.get<CartItem>('/cart');
    return response.data[0];
}

const addToCart = async (item: CartItem): Promise<CartItem> => {
    const response = await axiosInstance.post<CartItem>('/cart/items', item);
    return response.data;
}

const updateCart = async (itemId: string, item: Partial<CartItem>): Promise<CartItem> => {
    const response = await axiosInstance.patch<CartItem>(`/cart/items/${itemId}`, item);
    return response.data;
}
const removeFromCart = async (itemId: string): Promise<void> => {
    await axiosInstance.delete(`/cart/items/${itemId}`);
}
const applyCoupon = async (couponCode: string): Promise<CartItem> => {
    const response = await axiosInstance.post<CartItem>('/cart/coupons', { couponCode });
    return response.data;
}
const clearCart = async (): Promise<void> => {
    await axiosInstance.delete('/cart');
}

export {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    applyCoupon,
    clearCart
};