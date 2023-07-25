import ResponsiveAppBar from '../../../src/components/global/AppBar';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IUserSignIn } from './interfaces';
import { hashPassword } from '../../../src/helpers/crypto';

const SignUp = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const hashedPassword = hashPassword(user.password);

    const newUser: IUserSignIn = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
    };

    fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        if (res.status === 201) {
          navigate('/auth');
        }
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  }
  return (
    <div>
      <ResponsiveAppBar />
      <h1 className='title'>{'Welcome!'}</h1>

      <form>
        <Box
          sx={{
            backgroundColor: 'rgb(173 167 179 / 54%)',
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
            {'Sign Up'}
          </Typography>

          <TextField
            name='name'
            value={user.name}
            margin='normal'
            type='text'
            label='Name'
            variant='outlined'
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

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
                backgroundColor: '#ff9800',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#f57c00',
                },
              }}
              variant='contained'
            >
              Sign Up
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
            <Link to='/auth'> Already have an account? Login</Link>
          </Button>
        </Box>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
