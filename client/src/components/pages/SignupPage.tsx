import React from 'react';
import { Button, TextField, Typography, Box, Container, Paper } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../providers/hooks'; 
import { signupThunk } from '../providers/auth/authThunks';
import { useNavigate } from 'react-router-dom';  
import { UserStatusEnum } from '../../schemas/authSchema';

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 
  const user = useAppSelector((state) => state.auth.user); 

  if (user.status === UserStatusEnum.logged) {
    navigate('/chat');
    return null; 
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Создать аккаунт
        </Typography>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            const name = formData.get('name') as string;
            const nick = formData.get('nick') as string;
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            dispatch(signupThunk({ name, nick, email, password }));
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField label="Имя" name="name" type="text" fullWidth required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField label="Никнейм" name="nick" type="text" fullWidth required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField label="Электронная почта" name="email" type="email" fullWidth required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField label="Пароль" type="password" name="password" fullWidth required />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Подтвердите пароль"
              type="password"
              name="confirmPassword"
              fullWidth
              required
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" type="submit" sx={{ width: '100%' }}>
              Зарегистрироваться
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SignupPage;
