import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { addIngredient, addBun } from '../../services/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const location = useLocation();
  const dispatch = useDispatch();
  const handleAdd = (): void => {
    const constructorIngredient = {
      ...ingredient,
      id: crypto.randomUUID(),
    };

    if (ingredient.type === 'bun') {
      dispatch(addBun(constructorIngredient));
    } else {
      dispatch(addIngredient(constructorIngredient));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
