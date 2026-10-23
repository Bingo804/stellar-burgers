import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logoutThunk } from '../../services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutThunk())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch((error: unknown) => {
        console.error('Ошибка выхода:', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
