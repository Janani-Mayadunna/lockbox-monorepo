import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../components/global/AppBar';
import { useAppDispatch } from '../../../src/store';
import { loginRequest } from './redux/actions';
import { LoginPayload } from './redux/types';
import { generateVaultKey, hashPassword } from '../../../src/helpers/crypto';
import {
  authorizedFetch,
  getUserSalt,
} from '../../../src/helpers/request-interceptor';

const Auth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('jwt-lockbox')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const hashedPassword = hashPassword(user.password);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let data: LoginPayload = {
      values: {
        email: user.email,
        password: hashedPassword,
      },
    };

    await dispatch(loginRequest(data));

    const token = localStorage.getItem('jwt-blogapp');
    console.log('TOKEN', token);
    console.log(data);

    setTimeout(() => {
      handleGetUser();
    }, 2000);
  };

  const handleGetUser = async () => {
    await authorizedFetch('http://localhost:4000/api/auth/current-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res?) => res.json())
      .then((data) => {
        localStorage.setItem('current-user', JSON.stringify(data.user));
      })
      .catch((err) => {
        console.log('err: ', err);
      });

    const salt = getUserSalt();

    const vaultKey = generateVaultKey({
      hashedPassword: hashedPassword,
      email: user.email,
      salt: salt,
    });

    //set vaultKey in local storage
    localStorage.setItem('VK', vaultKey);
  };

  return (
    <div>
      <ResponsiveAppBar />
      <h1 className='title'>{'Hello again!'}</h1>

      <form>
        <Box
          sx={{
            backgroundColor: 'rgb(110 170 240 / 50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '45ch',
            margin: 'auto',
            marginTop: '5ch',
            padding: '5ch',
            borderRadius: '2ch',
          }}
        >
          <Typography variant='h4' paddingBottom={3} textAlign='center'>
            {'Login'}
          </Typography>

          <TextField
            name='email'
            value={user.email}
            margin='normal'
            type='text'
            label='Email'
            variant='outlined'
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <TextField
            name='password'
            value={user.password}
            margin='normal'
            type='password'
            label='Password'
            variant='outlined'
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <Link to='/dashboard' style={{ textDecoration: 'none' }}>
            <Button
              onClick={handleSubmit}
              type='submit'
              sx={{
                borderRadius: '4px',
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#0056b3',
                },
              }}
              variant='contained'
            >
              Login
            </Button>
          </Link>

          <Button
            sx={{
              marginTop: 2,
              borderRadius: 2,
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              '&:hover': {
                textDecoration: 'none',
              },
            }}
          >
            <Link to='/signup'> New here? Sign Up</Link>
          </Button>
        </Box>
      </form>
      <br />
    </div>
  );
};

export default Auth;
