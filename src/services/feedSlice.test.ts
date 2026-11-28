import { getFeedsApi } from '../utils/burger-api';
import feedReducer, { getFeedsThunk } from './feedSlice';

jest.mock('../utils/burger-api', () => ({
  getFeedsApi: jest.fn(),
}));

const mockResponse = {
  success: true,
  orders: [],
  total: 150,
  totalToday: 12,
};

describe('Редьюсер ленты заказов', () => {
  test('возвращает начальное состояние', () => {
    const state = feedReducer(undefined, {
      type: 'UNKNOWN_ACTION',
    });
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null,
    });
  });
  test('устанавливает isLoading при начале загрузки', () => {
    const action = getFeedsThunk.pending('test-request-id');
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });
  test('сохраняет данные после успешной загрузки', () => {
    const action = getFeedsThunk.fulfilled(mockResponse, 'requestId');

    const state = feedReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.total).toEqual(mockResponse.total);
    expect(state.totalToday).toEqual(mockResponse.totalToday);
  });
  test('сохраняет ошибку при неудачной загрузке', () => {
    const action = getFeedsThunk.rejected(
      new Error('Ошибка загрузки'),
      'requestId',
      undefined
    );
    const state = feedReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
  test('сохраняет сообщение по умолчанию, если ошибка не содержит текста', () => {
    const error = Object.assign(new Error(), { message: undefined });

    const action = getFeedsThunk.rejected(error, 'requestId', undefined);

    const state = feedReducer(undefined, action);

    expect(state.error).toBe('Не удалось загрузить ленту заказов');
  });
  test('загружает ленту заказов через асинхронный запрос', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const extra = undefined;
    (getFeedsApi as jest.Mock).mockResolvedValue(mockResponse);
    const result = await getFeedsThunk()(dispatch, getState, extra);
    expect(result.payload).toEqual(mockResponse);
    expect(getFeedsApi).toHaveBeenCalledTimes(1);
  });
});
