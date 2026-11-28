import { getIngredientsApi } from '../utils/burger-api.ts';
import ingredientsReducer, { getIngredients } from './createSlice';
import { mockIngredients } from './mocks.ts';

jest.mock('../utils/burger-api.ts');

describe('Редьюсер ингредиентов', () => {
  test('возвращает начальное состояние', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('устанавливает isLoading в true при начале запроса', () => {
    const action = getIngredients.pending('test-request-id');
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(true);
  });
  test('сохраняет ингредиенты после успешной загрузки', () => {
    const action = getIngredients.fulfilled(mockIngredients, 'requestId');

    const state = ingredientsReducer(undefined, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });
  test('сохраняет ошибку при неудачной загрузке', () => {
    const action = getIngredients.rejected(
      new Error('Ошибка загрузки'),
      'requestId',
      undefined
    );
    const state = ingredientsReducer(undefined, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(action.error);
  });
  test('загружает ингредиенты через асинхронный запрос', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const extra = undefined;
    (getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);
    const result = await getIngredients()(dispatch, getState, extra);
    expect(result.payload).toEqual(mockIngredients);
    expect(getIngredientsApi).toHaveBeenCalledTimes(1);
  });
});
