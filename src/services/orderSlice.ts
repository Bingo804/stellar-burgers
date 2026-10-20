import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '../utils/burger-api';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const getOrdersThunk = createAsyncThunk('orders/getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

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
      });
  },
});

export default orderSlice.reducer;
