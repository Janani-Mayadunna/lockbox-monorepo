import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../../utils/crypto';
import { userLogin } from '../../utils/api';
import { Container } from '@mui/material';

const Login: React.FC<{}> = () => {
  const navigate = useNavigate();

  const [data, setData] = React.useState({
    email: '',
    password: '',
  });
  const hashedPassword = hashPassword(data.password);

  const handleLogin = async () => {
    userLogin(data.email, hashedPassword);

    // const retToken = await new Promise<string | null>((resolve) => {
    //   chrome.runtime.sendMessage(
    //     { action: 'getToken' },
    //     (response) => {
    //       console.log('Background script response:', response);
    //       // when using use response.token
    //     }
    //   );
    // });

    // console.log('retToken', retToken);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'tokenUpdated') {
        if (message.token) {
          navigate('/dashboard');
        }
      }
    });
  };

  React.useEffect(() => {
    chrome.storage.local.get(['token']).then((result) => {
      if (result.token) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  // const getAllVaults = async () => {
  //   await authorizedFetch('https://surge-lockbox-prod.up.railway.app/api/vault', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log('just data login', data);
  //       // chrome.runtime.sendMessage(
  //       //   { action: 'setAllUserVaults', userVaults: data },
  //       //   (response) => {
  //       //     console.log('Background script response:', response);
  //       //   }
  //       // );
  //     })
  //     .catch((err: any) => {
  //       // throw new Error(err);
  //       console.log('err', err);
  //     });
  // };

  // React.useEffect(() => {
  //   getAllVaults();
  // }, []);

  return (
    <Container
      sx={{ height: '400px', minWidth: '300px', overflowY: 'scroll', pb: 8 }}
    >
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
    </Container>
  );
};

export default Login;
