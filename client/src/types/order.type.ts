import { CartItem } from "./cart.type";

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type ShippingMethodType = 'standard' | 'express' | 'payondelivery';

export interface ShippingAddress {
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

export interface Order {
    id: string;
    user_id: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    status: OrderStatus;
    shipping_method: ShippingMethodType;
    billing_address: ShippingAddress;
    shipping_address: ShippingAddress;
    payment_method: string;
    createdAt: string;
    updatedAt: string;
    tracking : {
        tracking_number?: string;
        estimated_delivery?: string;
        carrier?: string;
        actual_delivery?: string;
    }
    payment_transaction_id?: string;
    notes?: string;
    coupon_code?: string;
}