/* eslint-disable no-console */
import React from 'react';
import { generateVaultKey, hashPassword } from '../helpers/crypto';
import { authorizedFetch, getUserSalt } from '../helpers/request-interceptor';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const backendUrl = 'http://localhost:4000/api';
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    email: '',
    password: '',
  });
  const hashedPassword = hashPassword(data.password);

  const handleLogin = async () => {
    fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: hashedPassword,
      }),
    })
      .then((response) => {
        response.json().then((data) => {
          console.log('response', response);
          if (response.status === 201) {
            console.log('data', data);
            const token = data.access_token;

            localStorage.setItem('jwt-lockbox', JSON.stringify(data));
            localStorage.setItem('isLoggedIn', JSON.stringify(true));

            console.log('Successfully Logged In!');
            console.log(data);

            setTimeout(() => {
              handleGetUser();
            }, 2000);

            return token;
          } else {
            console.log('Failed to Login');
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGetUser = async () => {
    await authorizedFetch('http://localhost:4000/api/auth/current-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem('current-user', JSON.stringify(data.user));
        navigate('/vault');
      })
      .catch((err) => {
        console.log(err);
      });

    const salt = getUserSalt();

    const vaultKey = generateVaultKey({
      hashedPassword: hashedPassword,
      email: data.email,
      salt: salt,
    });

    localStorage.setItem('VK', vaultKey);
  };

  React.useEffect(() => {
    if (localStorage.getItem('jwt-lockbox')) {
      navigate('/vault');
    }
  }, [navigate]);

  return (
    <div>
      <h1>LockBox Password Manager</h1>
      <div>
        <label htmlFor='email'>Email:</label>
        <input
          type='text'
          id='email'
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input
          type='password'
          id='password'
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      <div>
        <button
          onClick={handleLogin}
          id='save'
          style={{
            marginBottom: '10px',
            marginTop: '10px',
            color: 'black',
          }}
        >
          Login
        </button>
        <br />
      </div>
    </div>
  );
};

export default Login;
