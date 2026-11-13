import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumberThunk } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.orders.orders);
  const currentOrder = useSelector((state) => state.orders.currentOrder);
  const isLoading = useSelector((state) => state.orders.isLoading);
  const error = useSelector((state) => state.orders.error);

  const orderNumber = Number(number);

  const orderData =
    [...feedOrders, ...userOrders].find((order) => order.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    const orderExistsInStore = [...feedOrders, ...userOrders].some(
      (order) => order.number === orderNumber
    );

    if (
      number &&
      Number.isFinite(orderNumber) &&
      orderNumber > 0 &&
      !orderExistsInStore &&
      currentOrder?.number !== orderNumber
    ) {
      void dispatch(getOrderByNumberThunk(orderNumber));
    }
  }, [number, orderNumber, feedOrders, userOrders, currentOrder, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!number || !Number.isFinite(orderNumber) || orderNumber <= 0) {
    return <p className="text text_type_main-default">Некорректный номер заказа</p>;
  }

  if (!orderInfo && isLoading) {
    return <Preloader />;
  }

  if (!orderInfo && error) {
    return <p className="text text_type_main-default">{error}</p>;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
