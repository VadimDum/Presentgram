import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../providers/hooks';
import { logoutThunk } from '../providers/auth/authThunks';
import { UserStatusEnum } from '../../schemas/authSchema';

export default function NavBar(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logoutThunk()).unwrap();
      alert('Logged out successfully');

      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {location.pathname !== '/' && (
            <Typography variant="h4" component="div" sx={{ flexGrow: 0 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src="/Subject.png"
                  alt="Logo"
                  style={{ width: '50px', height: 'auto', marginTop: '8px' }}
                />
              </Link>
            </Typography>
          )}

          <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
            {user.status === UserStatusEnum.logged ? (
              <div style={{ color: 'blue', fontWeight: '400' }}>
                <Button color="primary" onClick={() => navigate('/chat')}>
                  Чат
                </Button>
                <Button
                  color="primary"
                  onClick={() => navigate(`/paint/${(+new Date()).toString(16)}`)}
                >
                  Рисовалка
                </Button>
                <Button color="primary" onClick={() => navigate(`/profile/${user.id}`)}>
                  Профиль
                </Button>
                <Button color="primary" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            ) : (
              <div style={{ color: 'blue', fontWeight: '400' }}>
                <Button color="primary" onClick={() => navigate('/login')}>
                  Вход
                </Button>
                <Button color="primary" onClick={() => navigate('/signup')}>
                  Регистрация
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
