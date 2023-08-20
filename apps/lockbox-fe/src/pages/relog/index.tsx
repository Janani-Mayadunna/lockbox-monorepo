import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import { Backdrop, Card, CircularProgress } from '@mui/material';
import { LoginPayload } from '../auth/redux/types';
import { useAppDispatch } from '../../../src/store';
import { useNavigate } from 'react-router';
import { loginRequest, logoutRequest } from '../auth/redux/actions';
import { generateVaultKey, hashPassword } from '../../../src/helpers/crypto';
import ENVIRONMENT from '../../../src/helpers/environment';
import {
  authorizedFetch,
  getUserSalt,
} from '../../../src/helpers/request-interceptor';
import useAuthentication from '../../../src/components/auth/hooks/use-authentication';

export default function SignIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthentication();
  const authenticated = isAuthenticated();

  const [backdropOpen, setBackdropOpen] = React.useState(false);

  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });
  const hashedPassword = hashPassword(user.password);

  //handler backdrop loading state
  const handleClose = () => {
    setBackdropOpen(false);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const loginData: LoginPayload = {
      values: {
        email: user.email,
        password: hashedPassword,
      },
    };

    try {
      dispatch(loginRequest(loginData));
      setBackdropOpen(true);

      // if dispatch is success, navigate to dashboard
    } catch (error: any) {
      throw new Error(error);
    }

    localStorage.getItem('jwt-blogapp');

    setTimeout(() => {
      handleGetUser();
    }, 2000);
  };

  const handleGetUser = async () => {
    await authorizedFetch(`${ENVIRONMENT.BACKEND_API}/auth/current-user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res?) => res.json())
      .then((data) => {
        localStorage.setItem('current-user', JSON.stringify(data.user));
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
    localStorage.setItem('VK', vaultKey);
  };

  React.useEffect(() => {
    if (!authenticated) {
      dispatch(logoutRequest());
    } else {
      // the time out is set because to decrypt password, username, notes and other fields it takes some time.
      // otherwise an error is thrown because the fields are not decrypted yet
      // ideally 2 s is enough to decrypt all fields
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  }, [authenticated, dispatch, isAuthenticated, navigate]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
        onClick={handleClose}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <ResponsiveAppBar />
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Card sx={{ mt: 8, p: 5 }}>
          <Card sx={{ p: 1, backgroundColor: '#f07b7b26' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: '#d71f1f', alignItems: 'center' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
            <Typography
              sx={{ color: 'red', display: 'flex', textAlign: 'center' }}
            >
              You have been logged out due to inactivity. Continue to log in
              again
            </Typography>
          </Card>
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component='form' noValidate sx={{ mt: 1 }}>
              <TextField
                margin='normal'
                value={user.email}
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <TextField
                margin='normal'
                required
                value={user.password}
                fullWidth
                name='password'
                label='Master Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}
