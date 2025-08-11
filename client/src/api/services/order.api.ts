import { Order, OrderStatus } from "@/types/order.type";
import axiosInstance from "../axios";


const createOrder = async (orderData: Order): Promise<Order> => {
    try {
        const response = await axiosInstance.post<Order>("/order", orderData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
    }
}

const getOrder = async (orderId: string): Promise<Order> => {
    try {
        const response = await axiosInstance.get<Order>(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch order: ${error.message}`);
    }
}

const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string): Promise<Order> => {
    try {
        const response = await axiosInstance.patch<Order>(`/order/${orderId}/status`, { status, trackingNumber });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
    }
}

const addShipping = async (orderId: string, shippingData: unknown): Promise<Order> => {
    try {
        const response = await axiosInstance.post<Order>(`/order/${orderId}/shipping`, shippingData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to add shipping: ${error.message}`);
    }
}

const processRefund = async (orderId: string, refundData: unknown): Promise<Order> => {
    try {
        const response = await axiosInstance.post<Order>(`/order/${orderId}/refunds`, refundData);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to process refund: ${error.message}`);
    }
}

const deleteOrder = async (orderId: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/order/${orderId}`);
    } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
    }
}

export {
    createOrder,
    getOrder,
    updateOrderStatus,
    addShipping,
    processRefund,
    deleteOrder
}