import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../utils/burger-api';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TConstructorIngredient, TConstructorState } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);

    return data.order;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.bun = action.payload;
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;

      const [item] = state.ingredients.splice(fromIndex, 1);

      state.ingredients.splice(toIndex, 0, item);
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка создания заказа';
      });
  },
});

export const { addBun, addIngredient, removeIngredient, moveIngredient, clearOrder } =
  burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
