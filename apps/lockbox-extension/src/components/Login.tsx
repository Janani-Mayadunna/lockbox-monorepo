import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../utils/crypto';
import { userLogin } from '../utils/api';

const Login: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    email: '',
    password: '',
  });
  const hashedPassword = hashPassword(data.password);

  const handleLogin = () => {
    userLogin(data.email, hashedPassword);

    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  React.useEffect(() => {
    if (localStorage.getItem('jwt-lockbox')) {
      navigate('/dashboard');
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

        <button onClick={() => navigate('/dashboard')}>Go to dash</button>

        <br />
      </div>
    </div>
  );
};

export default Login;
