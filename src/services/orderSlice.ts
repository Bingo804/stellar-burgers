import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  createdOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
};

const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  createdOrder: null,
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
};

export const getOrdersThunk = createAsyncThunk('orders/getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);

    if (!response.success || !response.orders.length) {
      throw new Error('Заказ не найден');
    }

    return response.orders[0];
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.createdOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказы';
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      })
      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.createdOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.error.message ?? 'Ошибка создания заказа';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export default orderSlice.reducer;
