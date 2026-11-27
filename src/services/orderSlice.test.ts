import { configureStore } from '@reduxjs/toolkit';

import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '../utils/burger-api';
import orderReducer, {
  clearOrder,
  getOrdersThunk,
  getOrderByNumberThunk,
  createOrder,
} from './orderSlice';

jest.mock('../utils/burger-api', () => ({
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  orderBurgerApi: jest.fn(),
}));

const mockOrderState = {
  orders: [],
  currentOrder: null,
  createdOrder: {
    _id: 'order-1',
    status: 'done',
    name: 'Тестовый бургер',
    createdAt: '',
    updatedAt: '',
    number: 123,
    ingredients: [],
  },
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
} satisfies NonNullable<Parameters<typeof orderReducer>[0]>;

const mockOrder = mockOrderState.createdOrder;

const mockOrders = [mockOrder];

describe('Редьюсер заказов', () => {
  test('возвращает начальное состояние', () => {
    const state = orderReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });

    expect(state).toEqual({
      orders: [],
      currentOrder: null,
      createdOrder: null,
      isLoading: false,
      error: null,
      isCreating: false,
      createError: null,
    });
  });

  test('очищает созданный заказ', () => {
    const state = orderReducer(mockOrderState, clearOrder());

    expect(state.createdOrder).toBe(null);
  });

  test('устанавливает загрузку при начале получения заказов', () => {
    const state = orderReducer(mockOrderState, getOrdersThunk.pending('request-id'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('сохраняет полученные заказы', () => {
    const state = orderReducer(
      mockOrderState,
      getOrdersThunk.fulfilled(mockOrders, 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  test('сохраняет ошибку при неудачном получении заказов', () => {
    const state = orderReducer(
      mockOrderState,
      getOrdersThunk.rejected(new Error('Ошибка загрузки заказов'), 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  test('устанавливает сообщение по умолчанию при ошибке загрузки заказов', () => {
    const error = Object.assign(new Error(), { message: undefined });

    const state = orderReducer(
      mockOrderState,
      getOrdersThunk.rejected(error, 'request-id')
    );

    expect(state.error).toBe('Не удалось загрузить заказы');
  });

  test('устанавливает загрузку при получении заказа по номеру', () => {
    const state = orderReducer(
      mockOrderState,
      getOrderByNumberThunk.pending('request-id', 123)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
    expect(state.currentOrder).toBe(null);
  });

  test('сохраняет полученный заказ по номеру', () => {
    const state = orderReducer(
      mockOrderState,
      getOrderByNumberThunk.fulfilled(mockOrder, 'request-id', 123)
    );

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  test('сохраняет ошибку при неудачном получении заказа', () => {
    const state = orderReducer(
      mockOrderState,
      getOrderByNumberThunk.rejected(new Error('Заказ не найден'), 'request-id', 123)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Заказ не найден');
  });

  test('устанавливает сообщение по умолчанию при ошибке получения заказа', () => {
    const error = Object.assign(new Error(), { message: undefined });

    const state = orderReducer(
      mockOrderState,
      getOrderByNumberThunk.rejected(error, 'request-id', 123)
    );

    expect(state.error).toBe('Не удалось загрузить заказ');
  });

  test('устанавливает загрузку при создании заказа', () => {
    const state = orderReducer(
      mockOrderState,
      createOrder.pending('request-id', ['bun', 'filling'])
    );

    expect(state.isCreating).toBe(true);
    expect(state.createError).toBe(null);
    expect(state.createdOrder).toBe(null);
  });

  test('сохраняет созданный заказ', () => {
    const state = orderReducer(
      mockOrderState,
      createOrder.fulfilled(mockOrder, 'request-id', ['bun', 'filling'])
    );

    expect(state.isCreating).toBe(false);
    expect(state.createdOrder).toEqual(mockOrder);
  });

  test('сохраняет ошибку при неудачном создании заказа', () => {
    const state = orderReducer(
      mockOrderState,
      createOrder.rejected(new Error('Ошибка создания заказа'), 'request-id', [
        'bun',
        'filling',
      ])
    );

    expect(state.isCreating).toBe(false);
    expect(state.createError).toBe('Ошибка создания заказа');
  });

  test('устанавливает сообщение по умолчанию при ошибке создания заказа', () => {
    const error = Object.assign(new Error(), { message: undefined });

    const state = orderReducer(
      mockOrderState,
      createOrder.rejected(error, 'request-id', ['bun', 'filling'])
    );

    expect(state.createError).toBe('Ошибка создания заказа');
  });
});

describe('Асинхронные запросы заказов', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('загружает список заказов с сервера', async () => {
    jest.mocked(getOrdersApi).mockResolvedValue(mockOrders);

    const store = configureStore({
      reducer: orderReducer,
    });

    await store.dispatch(getOrdersThunk());

    expect(getOrdersApi).toHaveBeenCalledTimes(1);
    expect(store.getState().orders).toEqual(mockOrders);
  });

  test('получает заказ по номеру с сервера', async () => {
    jest.mocked(getOrderByNumberApi).mockResolvedValue({
      success: true,
      orders: [mockOrder],
    });

    const store = configureStore({
      reducer: orderReducer,
    });

    await store.dispatch(getOrderByNumberThunk(123));

    expect(getOrderByNumberApi).toHaveBeenCalledWith(123);
    expect(store.getState().currentOrder).toEqual(mockOrder);
  });

  test('возвращает ошибку, если заказ не найден', async () => {
    jest.mocked(getOrderByNumberApi).mockResolvedValue({
      success: false,
      orders: [],
    });

    const store = configureStore({
      reducer: orderReducer,
    });

    await store.dispatch(getOrderByNumberThunk(123));

    expect(store.getState().error).toBe('Заказ не найден');
  });

  test('создаёт заказ на сервере', async () => {
    jest.mocked(orderBurgerApi).mockResolvedValue({
      success: true,
      name: 'Тестовый бургер',
      order: mockOrder,
    });

    const ingredients = ['bun', 'filling'];

    const store = configureStore({
      reducer: orderReducer,
    });

    await store.dispatch(createOrder(ingredients));

    expect(orderBurgerApi).toHaveBeenCalledWith(ingredients);
    expect(store.getState().createdOrder).toEqual(mockOrder);
  });
});
