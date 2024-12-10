import React, { useEffect } from 'react';
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginThunk } from '../providers/auth/authThunks';
import { useAppDispatch, useAppSelector } from '../providers/hooks';
import { UserStatusEnum } from '../../schemas/authSchema';

export default function LoginPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user.status === UserStatusEnum.logged) {
      navigate('/chat');
    }
  }, [user.status, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Войти в систему
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.currentTarget.email.value;
            const password = e.currentTarget.password.value;
            dispatch(loginThunk({ email, password }));
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField label="Электронная почта" type="email" name="email" fullWidth required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField label="Пароль" type="password" name="password" fullWidth required />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
              Войти
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
