import { Navigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  if (isAuthChecked === false) {
    return null;
  }
  if (user === null && onlyUnAuth === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user !== null && onlyUnAuth === true) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
