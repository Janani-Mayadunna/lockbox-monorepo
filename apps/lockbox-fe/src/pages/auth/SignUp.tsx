import ResponsiveAppBar from '../../../src/components/global/AppBar';
import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { IUserSignIn } from './interfaces';
import { authorizedFetch } from '../../../src/helpers/request-interceptor';
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

    authorizedFetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((res) => {
        console.log('res: ', res);
        if(res.status === 201) {
          navigate('/dashboard');
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
            backgroundColor: 'white', // Custom text box background color
            borderRadius: '4px', // Custom border radius
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
              backgroundColor: '#ff9800', // Custom button color
              color: '#fff', // Text color
              '&:hover': {
                backgroundColor: '#f57c00', // Custom hover color
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
          <Link to='/'> Already have an account? Login</Link>
        </Button>
      </Box>
    </form>
      <br />
    </div>
  );
};

export default SignUp;

