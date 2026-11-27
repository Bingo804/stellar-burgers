import burgerConstructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
} from './burgerConstructorSlice';
import { mockIngredients } from './mocks.ts';
import { createOrder } from './orderSlice';

describe('Редьюсер конструктора бургера', () => {
  test('возвращает начальное состояние', () => {
    const state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
  test('добавляет булку в конструктор', () => {
    const mockBun = {
      ...mockIngredients[0],
      id: '1',
    };
    const state = burgerConstructorReducer(undefined, addBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });
  test('добавляет ингредиент в конструктор', () => {
    const mockIngredient = {
      ...mockIngredients[0],
      type: 'main',
      id: '2',
    };
    const state = burgerConstructorReducer(undefined, addIngredient(mockIngredient));
    expect(state.ingredients).toEqual([mockIngredient]);
  });
  test('удаляет ингредиент из конструктора', () => {
    const mockIngredient = {
      ...mockIngredients[0],
      type: 'main',
      id: '2',
    };

    const state = burgerConstructorReducer(undefined, addIngredient(mockIngredient));

    const newState = burgerConstructorReducer(state, removeIngredient('2'));

    expect(newState.ingredients).toEqual([]);
  });
  test('перемещает ингредиент в конструкторе', () => {
    const ingredients = [
      { ...mockIngredients[0], type: 'main', id: '1' },
      { ...mockIngredients[0], type: 'main', id: '2' },
      { ...mockIngredients[0], type: 'main', id: '3' },
    ];

    let state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    ingredients.forEach((ingredient) => {
      state = burgerConstructorReducer(state, addIngredient(ingredient));
    });

    const newState = burgerConstructorReducer(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 2 })
    );

    expect(newState.ingredients.map((item) => item.id)).toEqual(['2', '3', '1']);
  });
  test('очищает конструктор после успешного создания заказа', () => {
    const mockBun = {
      ...mockIngredients[0],
      type: 'bun',
      id: '1',
    };

    const mockIngredient = {
      ...mockIngredients[0],
      type: 'main',
      id: '2',
    };

    let state = burgerConstructorReducer(undefined, addBun(mockBun));

    state = burgerConstructorReducer(state, addIngredient(mockIngredient));

    const newState = burgerConstructorReducer(
      state,
      createOrder.fulfilled(
        {
          _id: 'order-1',
          status: 'done',
          name: 'Тестовый бургер',
          createdAt: '',
          updatedAt: '',
          number: 123,
          ingredients: ['1', '2'],
        },
        'request-id',
        ['1', '2']
      )
    );

    expect(newState).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
