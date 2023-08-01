/* eslint-disable no-console */
import React, { useState } from 'react';
import { authorizedFetch, getVaultKey } from '../helpers/request-interceptor';
import { encryptVault } from '../helpers/crypto';
import { useNavigate } from 'react-router-dom';

const AddPassword = () => {
  const navigate = useNavigate();
  const [vaultData, setVaultData] = useState({
    username: '',
    password: '',
    link: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReset();
    const vaultKey = getVaultKey();
    const vaultPW = vaultData.password;

    const encryptedVaultPW = encryptVault({
      vaultPassword: vaultPW,
      vaultKey,
    });

    const newVault = {
      link: vaultData.link,
      username: vaultData.username,
      password: encryptedVaultPW,
    };

    authorizedFetch('http://localhost:4000/api/vault', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVault),
    })
      .then((res) => {
        if(res.status !== 201) {
          console.log('Failed to add password');
        } else {
          return res.json();
        }
      })
      .catch((err) => {
          console.log(err);
      });
  };

  const handleReset = () => {
    setVaultData({
      username: '',
      password: '',
      link: '',
    });
  };

  return (
    <div>
      <h1>Add Password</h1>

      <div>
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label htmlFor='username'>Username:</label>
          <input
            value={vaultData.username}
            name='username'
            style={{ marginBottom: '10px', padding: '5px' }}
            onChange={(e) =>
              setVaultData({ ...vaultData, username: e.target.value })
            }
          />

          <label htmlFor='password'>Password:</label>
          <input
            id='password'
            type='password'
            value={vaultData.password}
            name='password'
            style={{ marginBottom: '10px', padding: '5px' }}
            onChange={(e) =>
              setVaultData({ ...vaultData, password: e.target.value })
            }
          />

          <label htmlFor='link'>URI</label>
          <input
            type='text'
            value={vaultData.link}
            name='link'
            style={{ marginBottom: '10px', padding: '5px' }}
            onChange={(e) =>
              setVaultData({ ...vaultData, link: e.target.value })
            }
          />

          <button
            type='submit'
            onClick={handleSubmit}
            variant='contained'
            style={{
              marginBottom: '10px',
              backgroundColor: '#007bff',
              color: 'black',
            }}
          >
            Submit
          </button>

          <button
            type='reset'
            onClick={() =>
              handleReset()
            }
            variant='contained'
            style={{
              marginBottom: '10px',
              backgroundColor: '#6c757d',
              color: 'black',
            }}
          >
            Reset
          </button>

          <button
              type='button'
              style={{
                marginBottom: '10px',
                backgroundColor: 'orange',
                color: 'black',
              }}
              onClick={() => navigate('/vault')}
            >
              View Vault
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddPassword;
