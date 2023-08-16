import ResponsiveAppBar from '../../../components/global/AppBar';
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IUserSignIn } from '../interfaces';
import { hashPassword } from '../../../helpers/crypto';
import { useAppDispatch, useAppSelector } from '../../../../src/store';
import { signupRequest } from '../redux/actions';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const SignUp = () => {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    salt: '',
  });
  const navigate = useNavigate();

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const hashedPassword = hashPassword(user.password);

    const newUser: IUserSignIn = {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      salt: user.salt,
    };

    dispatch(signupRequest(newUser));
  }

  React.useEffect(() => {
    if (message === 'signup successful') {
      navigate('/auth');
    }
  }, [navigate, message]);

  return (
    <div>
      <ResponsiveAppBar />
      {/* <h1 className="title">{'Welcome!'}</h1> */}
      <br />

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
          <Typography variant="h4" paddingBottom={3} textAlign="center">
            {'Sign Up'}
          </Typography>

          <TextField
            name="name"
            value={user.name}
            margin="normal"
            type="text"
            required
            label="Name"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              borderRadius: '4px',
              width: '90%',
            }}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <TextField
            name="email"
            value={user.email}
            margin="normal"
            required
            type="text"
            label="Email"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              width: '90%',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <TextField
            name="password"
            value={user.password}
            required
            margin="normal"
            type="password"
            label="Password"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              width: '90%',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <TextField
            name="salt"
            value={user.salt}
            margin="normal"
            type="text"
            label="Cutom Salt"
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              width: '90%',
              borderRadius: '4px',
            }}
            onChange={(e) => setUser({ ...user, salt: e.target.value })}
            InputProps={{
              endAdornment: (
                <Tooltip title="Provide your own salt to encrypt data, else a custom salt would be automatically generated">
                  <InputAdornment position="start">
                    <QuestionMarkIcon />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
          />

          <Button
            onClick={handleSubmit}
            type="submit"
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
            variant="contained"
          >
            Sign Up
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
            <Link to="/auth"> Already have an account? Login</Link>
          </Button>
        </Box>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
