import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authorizedFetch } from '../helpers/request-interceptor';
import { getVaultKey } from '../helpers/request-interceptor';
import { decryptVault } from '../helpers/crypto';

const Vault = () => {
  const navigate = useNavigate();
  const [vaultData, setVaultData] = useState([]);

  const getAllVaults = async () => {
    await authorizedFetch('http://localhost:4000/api/vault', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVaultData(data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useEffect(() => {
    getAllVaults();
  }, []);

  const decryptedVaults = vaultData.map((row) => {
    const vaultKey = getVaultKey();

    const decryptedVaultPW = decryptVault({
      vault: row.password,
      vaultKey: vaultKey,
    });

    return {
      ...row,
      password: decryptedVaultPW,
    };
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('jwt-lockbox');
      localStorage.setItem('isLoggedIn', JSON.stringify(false));
      localStorage.removeItem('current-user');
      localStorage.removeItem('VK');
    } catch (error) {
      throw new Error(error);
    }
    navigate('/');
  };

  return (
    <div>
      <h1>Vault</h1>

      <div style={{ width: '100%', marginTop: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', fontWeight: 'bold', color: '#333' }}>Link</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', fontWeight: 'bold', color: '#333' }}>Username</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2', fontWeight: 'bold', color: '#333' }}>Password</th>
          </tr>
        </thead>
        <tbody>
          {decryptedVaults.map((row, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{row.link}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{row.username}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{row.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      <button
        onClick={() => navigate('/add')}
        id='add'
        style={{
          marginTop: '10px',
          marginBottom: '10px',
          backgroundColor: '#007bff',
          color: 'black',
        }}
      >
        Add Password
      </button>
        <br/>
      <button
        onClick={handleLogout}
        id='add'
        style={{
          marginBottom: '10px',
          backgroundColor: 'red',
          color: 'black',
        }}
      >
        Log out
      </button>
    </div>
  );
};

export default Vault;
