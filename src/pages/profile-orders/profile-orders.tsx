import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { getOrdersThunk } from '../../services/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    void dispatch(getOrdersThunk());
  }, [dispatch]);
  return <ProfileOrdersUI orders={orders} />;
};
