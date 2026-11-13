// import { IngredientDetails } from '@/components';
import { combineReducers } from '@reduxjs/toolkit';

import burgerConstructorReducer from './burgerConstructorSlice';
import ingredientsReducer from './createSlice';
import feedReducer from './feedSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';

// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer = combineReducers({
  // TODO: Собрать здесь редьюсеры слайсов
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  user: userReducer,
  orders: orderReducer,
  feed: feedReducer,
});
