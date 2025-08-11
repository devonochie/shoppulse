/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartItem } from '@/types/cart.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as cartApi from '../../api/services/cart.api';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  shippingCost: number;
  tax: number;
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  shippingCost: 0,
  tax: 0,
  isOpen: false,
};

const calculateTotals = (items: CartItem[]) => {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.snapshot_price * item.quantity, 0);
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  return { itemCount, total, shippingCost, tax };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.shippingCost = totals.shippingCost;
      state.tax = totals.tax;
    },
    removeFromCart: (state, action: PayloadAction<{ id: string; size?: string; color?: string }>) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          )
      );

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.shippingCost = totals.shippingCost;
      state.tax = totals.tax;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number; size?: string; color?: string }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter((i) => i !== item);
        }
      }

      const totals = calculateTotals(state.items);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      state.shippingCost = totals.shippingCost;
      state.tax = totals.tax;
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.shippingCost = 0;
      state.tax = 0;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        const totals = calculateTotals(action.payload);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.shippingCost = totals.shippingCost;
        state.tax = totals.tax;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        console.error('Failed to fetch cart:', action.payload);
      });

    builder
      .addCase(addToCartThunk.fulfilled, (state, action: PayloadAction<CartItem>) => {
        const existingItem = state.items.find(
          (item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
        );    
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.items.push(action.payload);
        }
        const totals = calculateTotals(state.items);
        state.total = totals.total;
        state.itemCount = totals.itemCount;
        state.shippingCost = totals.shippingCost;
        state.tax = totals.tax;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        console.error('Failed to add item to cart:', action.payload);
      });
      
  }
});

const createCartThunk = <T, R = CartItem>(name: string, apiCall: (arg: T) => Promise<R>) => {
  return createAsyncThunk<R, T, { rejectValue: { message: string } }>(
    `carts/${name}`,
    async (arg, { rejectWithValue }) => {
      try {
        return await apiCall(arg);
      } catch (error: any) {
        return rejectWithValue({
          message: error.response?.data?.message || `${name} failed`
        });
      }
    }
  );
};

export const addToCartThunk = createCartThunk<CartItem>("addToCart", cartApi.addToCart)
export const removeFromCartThunk = createCartThunk<string, void>("removeFromCart", cartApi.removeFromCart);
export const updateCartThunk = createCartThunk<{ id: string, data: Partial<CartItem>}, CartItem>(
  "updateCart",
  ({id, data}) => cartApi.updateCart(id, data));
export const clearCartThunk = createCartThunk<null, void>("clearCart", cartApi.clearCart)
export const fetchCartThunk = createCartThunk<null, CartItem[]>("getCart", cartApi.getCart);  
export const applyCouponThunk = createCartThunk<string, CartItem>("applyCoupon", cartApi.applyCoupon);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;