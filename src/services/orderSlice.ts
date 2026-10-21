import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi, getOrderByNumberApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
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
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
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
      });
  },
});

export default orderSlice.reducer;
