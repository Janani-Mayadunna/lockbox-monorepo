import React, { useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../../components/global/AppBar';
import { useAppDispatch, useAppSelector } from '../../../store';
import { loginRequest } from '../redux/actions';
import { LoginPayload, LoginSuccessPayload } from '../redux/types';
import { generateVaultKey, hashPassword } from '../../../helpers/crypto';
import {
  authorizedFetch,
  getUserSalt,
} from '../../../helpers/request-interceptor';
import ENVIRONMENT from '../../../../src/helpers/environment';
import useAuthentication from '../../../../src/components/auth/hooks/use-authentication';

const Auth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();
  const authenticated = isAuthenticated();

  const { token }: LoginSuccessPayload = useAppSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  let isPasswordValid = true;
  let isEmailValid = true;

  const [backdropOpen, setBackdropOpen] = React.useState(false);
  const hashedPassword = hashPassword(user.password);

  const passwordRegex = new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\S+$).{8,20}$/,
  );

  const emailRegex = new RegExp(
    /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/,
  );

  //handler backdrop loading state
  const handleClose = () => {
    setBackdropOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    isEmailValid = emailRegex.test(user.email);

    isPasswordValid = passwordRegex.test(user.password);

    setPasswordError(!isPasswordValid);
    setEmailError(!isEmailValid);

    let data: LoginPayload = {
      values: {
        email: user.email,
        password: hashedPassword,
      },
    };

    if (isEmailValid && isPasswordValid) {
      try {
        dispatch(loginRequest(data));
        setBackdropOpen(true);

        setTimeout(() => {
          setBackdropOpen(false);
        }, 2000);
      } catch (err: any) {
        throw new Error(err);
      }
    }
  };

  React.useEffect(() => {
    // the time out is set because to decrypt password, username, notes and other fields it takes some time.
    // otherwise an error is thrown because the fields are not decrypted yet
    // ideally 2 s is enough to decrypt all fields
    if (authenticated) {
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [authenticated, navigate]);

  React.useEffect(() => {
    const handleGetUser = async () => {
      await authorizedFetch(`${ENVIRONMENT.BACKEND_API}/auth/current-user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res?) => res.json())
        .then((data) => {
          sessionStorage.setItem('current-user', JSON.stringify(data.user));
        })
        .catch((err: any) => {
          throw new Error(err);
        });

      const salt = getUserSalt();

      const vaultKey = generateVaultKey({
        hashedPassword: hashedPassword,
        email: user.email,
        salt: salt,
      });
      sessionStorage.setItem('VK', vaultKey);
    };

    if (authenticated) {
      handleGetUser();
    }
  }, [authenticated, hashedPassword, token?.access_token, user.email]);

  React.useEffect(() => {
    if (sessionStorage.getItem('jwt-lockbox')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
        onClick={handleClose}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      <ResponsiveAppBar />
      {/* <h1 className="title">{'Hello again!'}</h1> */}
      <br />

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
            type='email'
            label='Email'
            variant='outlined'
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
              width: '90%',
            }}
            inputProps={{ minLength: 3 }}
            error={emailError}
            helperText={emailError ? 'Invalid email' : ''}
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
              width: '90%',
            }}
            inputProps={{ minLength: 8 }}
            error={passwordError}
            helperText={passwordError ? 'Invalid Password' : ''}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

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
            <Link
              to='/signup'
              style={{ textDecoration: 'none', textTransform: 'capitalize' }}
            >
              {' '}
              New here? Sign Up
            </Link>
          </Button>
        </Box>
      </form>
      <br />
    </div>
  );
};

export default Auth;
