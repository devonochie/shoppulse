export interface Cart {
    id: string;
    product_id: string;
    title: string;
    snapshot_price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
    category: string;
    notes?: string;
}

export interface CartItem  extends Cart {
    user_id?: string;
    items: CartItem[];
    variant_id?: string;
    coupon_code?: string;
    shipping_method?: 'standard' | 'express' | 'payondelivery';
    subtotal: number;
    requires_price_check?: boolean;
}


