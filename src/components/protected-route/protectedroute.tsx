import { Navigate } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { ReactNode } from 'react';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element | null => {
  const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  if (isAuthChecked === false) {
    return null;
  }
  if (user === null && onlyUnAuth === false) {
    return <Navigate to="/login" />;
  }
  if (user !== null && onlyUnAuth === true) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
