/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, OrderStatus, ShippingAddress } from '@/types/order.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as orderApi from '../../api/services/order.api';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus; trackingNumber?: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
        if (action.payload.trackingNumber) {
          order.tracking.tracking_number = action.payload.trackingNumber;
        }
      }
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

const createOrderThunk = <T, R = Order
>(name: string, apiCall: (arg: T) => Promise<R>) => {
  return createAsyncThunk<R, T, { rejectValue: { message: string } }>(
    `products/${name}`,
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

export const createOrder = createOrderThunk<Order, Order>('createOrder', orderApi.createOrder)
export const fetchOrders = createOrderThunk<string, Order>('fetchOrders', orderApi.getOrder);
export const updateOrder = createOrderThunk<{ id: string; status: OrderStatus; trackingNumber?: string }, Order>(
  'updateOrder',
  ({ id, status, trackingNumber }) => orderApi.updateOrderStatus(id, status, trackingNumber)
);
export const addShipping = createOrderThunk<{ orderId: string; shippingData: ShippingAddress }, Order>(
  'addShipping',
  ({ orderId, shippingData }) => orderApi.addShipping(orderId, shippingData)
);
export const processRefund = createOrderThunk<{ orderId: string; refundData: unknown }, Order>(
  'processRefund',
  ({ orderId, refundData }) => orderApi.processRefund(orderId, refundData)
);
export const deleteOrder = createOrderThunk<string, void>('deleteOrder', orderApi.deleteOrder);


export const {
  setOrders,
  addOrder,
  updateOrderStatus,
  setCurrentOrder,
  setLoading,
  setError,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;