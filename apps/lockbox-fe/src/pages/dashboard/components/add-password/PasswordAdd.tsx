import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICreateVault } from './interfaces';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../helpers/request-interceptor';
import { decryptVault, encryptVault } from '../../../../helpers/crypto';

const PasswordAdd = () => {
  const [vaultData, setVaultData] = useState({
    username: '',
    password: '',
    link: '',
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const vaultKey = getVaultKey();

    const vaultPW = vaultData.password;

    const encryptedVaultPW = encryptVault({
      vault: vaultPW,
      vaultKey,
    });

    const newVault: ICreateVault = {
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
        console.log('res: ', res);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  return (
    <div>
      <h1 className='title'>Add Password</h1>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '300px',
          margin: '0 auto',
        }}
      >
        <label htmlFor='username' style={{ marginBottom: '10px' }}>
          Username
        </label>
        <input
          type='text'
          id='username'
          value={vaultData.username}
          name='username'
          style={{ marginBottom: '10px', padding: '5px' }}
          onChange={(e) =>
            setVaultData({ ...vaultData, username: e.target.value })
          }
        />

        <label htmlFor='password' style={{ marginBottom: '10px' }}>
          Password
        </label>
        <input
          type='password'
          id='password'
          value={vaultData.password}
          name='password'
          style={{ marginBottom: '10px', padding: '5px' }}
          onChange={(e) =>
            setVaultData({ ...vaultData, password: e.target.value })
          }
        />

        <label htmlFor='url' style={{ marginBottom: '10px' }}>
          URI
        </label>
        <input
          type='text'
          value={vaultData.link}
          id='link'
          name='link'
          style={{ marginBottom: '10px', padding: '5px' }}
          onChange={(e) => setVaultData({ ...vaultData, link: e.target.value })}
        />

        <button
          type='submit'
          onClick={handleSubmit}
          style={{
            marginBottom: '10px',
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
          }}
        >
          Submit
        </button>

        <button
          type='reset'
          onClick={() => setVaultData({ username: '', password: '', link: '' })}
          style={{
            marginBottom: '10px',
            padding: '5px 10px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
          }}
        >
          Reset
        </button>

        <button
          type='button'
          style={{
            marginBottom: '10px',
            padding: '5px 10px',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
          }}
        >
          <Link
            to='/dashboard'
            style={{ textDecoration: 'none', color: 'white' }}
          >
            Back
          </Link>
        </button>
      </form>

      <br />
      <br />
      <br />
    </div>
  );
};

export default PasswordAdd;
