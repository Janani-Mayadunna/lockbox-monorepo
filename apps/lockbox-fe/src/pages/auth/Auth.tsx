import { useState, useEffect, MouseEvent } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../components/global/AppBar';
import { useAppDispatch } from '../../../src/store';
import { getCurrentUser, loginRequest } from './redux/actions';
import { LoginPayload } from './redux/types';
import { hashPassword } from '../../../src/helpers/crypto';

const Auth = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem('jwt-lockbox');

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
      navigate('/dashboard');
    }
  }, [token]);

  function handleSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const hashedPassword = hashPassword(user.password);


    let data: LoginPayload = {
      values: {
        email: user.email,
        password: hashedPassword,
      },
    };
    dispatch(loginRequest(data));

    const token = localStorage.getItem('jwt-blogapp');
    console.log('TOKEN', token);
    console.log(data);
  }

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
            backgroundColor: 'white', // Custom text box background color
            borderRadius: '4px', // Custom border radius
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
            backgroundColor: 'white', // Custom text box background color
            borderRadius: '4px', // Custom border radius
          }}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <Link to='/dashboard' style={{ textDecoration: 'none' }}>
          <Button
            onClick={handleSubmit}
            type='submit'
            sx={{
              borderRadius: '4px', // Custom border radius
              marginTop: '20px', // Custom margin
              padding: '10px 20px', // Custom padding
              backgroundColor: '#007bff', // Custom button color
              color: '#fff', // Text color
              '&:hover': {
                backgroundColor: '#0056b3', // Custom hover color
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
          <Link to='/'> New here? Sign Up</Link>
        </Button>
      </Box>
    </form>
      <br />
    </div>
  );
};

export default Auth;
