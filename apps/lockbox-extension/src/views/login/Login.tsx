import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../../utils/crypto';
import { userLogin } from '../../utils/api';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const navigate = useNavigate();

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'replaceToLogin') {
      setValidity(false);
      // location.href = 'popup.html';
    }
    // sendResponse({ response: 'login' });
  });

  const [data, setData] = React.useState({
    email: '',
    password: '',
  });
  const [validity, setValidity] = React.useState<boolean>(true);
  const hashedPassword = hashPassword(data.password);

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    userLogin(data.email, hashedPassword);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'tokenUpdated') {
        if (message?.token) {
          navigate('/dashboard');
        }
      }
    });
  };

  React.useEffect(() => {
    chrome.storage.local.get(['token'], (token) => {
      if (!token) {
        chrome.storage.local.clear();
      }
    });
  }, [validity]);

  React.useEffect(() => {
    chrome.storage.local.get(['token']).then((result) => {
      if (result?.token) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  return (
    <Container
      sx={{ height: '400px', minWidth: '300px', overflowY: 'scroll', pb: 8 }}
    >
      <div>
        <Box sx={{ pt: 2 }}>
          <Typography
            variant='h5'
            sx={{
              display: ' flex',
              justifyContent: 'center',
              fontWeight: '600',
            }}
          >
            L O C K B O X
          </Typography>
        </Box>
        <div>
          <Card sx={{ mt: 2, p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar sx={{ m: 1, bgcolor: '#130e4f', alignItems: 'center' }}>
                <LockOutlinedIcon />
              </Avatar>
            </Box>
            <Typography
              sx={{ color: 'blue', display: 'flex', textAlign: 'center' }}
            ></Typography>

            <Box
              sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box component='form' noValidate sx={{ mt: 1 }}>
                <TextField
                  margin='normal'
                  value={data.email}
                  required
                  fullWidth
                  size='small'
                  id='email'
                  label='Email Address'
                  name='email'
                  autoFocus
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <TextField
                  margin='normal'
                  required
                  value={data.password}
                  fullWidth
                  size='small'
                  name='password'
                  label='Master Password'
                  type='password'
                  id='password'
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  onClick={handleLogin}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </Box>
            </Box>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;
