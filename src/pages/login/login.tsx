import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { clearError, loginUserThunk } from '../../services/userSlice';

type TLocationState = {
  from?: {
    pathname: string;
    search?: string;
    hash?: string;
  };
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const login = async (): Promise<void> => {
    await dispatch(loginUserThunk({ email, password })).unwrap();

    const state = location.state as TLocationState | null;
    const from = state?.from;

    const target = from ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}` : '/';

    void navigate(target, { replace: true });
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void login();
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
