/* eslint-disable react-hooks/exhaustive-deps */
import { getVaultKey } from '../../../src/helpers/request-interceptor';
import { decryptVault } from '../../../src/helpers/crypto';
import { Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SharedVault = () => {
  const { sharedToken } = useParams();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [encryptedSharedPW, setEncryptedSharedPW] = useState('');
  const [decryptedSharedPW, setDecryptedSharedPW] = useState('');

  const verifySharedLink = () => {
    fetch(`http://localhost:4000/api/vault/verify-link/${sharedToken}`, {
      method: 'Get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name! === 'TokenExpiredError') {
          setTokenExpired(true);
        } else {
          setTokenExpired(false);
          setEncryptedSharedPW(data.encryptedSharedPassword.password);
          const sharedPW = decryptSharedPassword();
          setDecryptedSharedPW(sharedPW);
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  };

  const vaultKey = getVaultKey();

  const decryptSharedPassword = () => {
    const decryptedSharedPassword = decryptVault({
      vault: encryptedSharedPW,
      vaultKey: vaultKey,
    });
    return decryptedSharedPassword;
  };

  useEffect(() => {
    verifySharedLink();
  }, [decryptedSharedPW, tokenExpired]);

  return (
    <Container>
      {tokenExpired ? (
        // Show this box if token is expired
        <Box>
          <h1 className="title">Shared Page</h1>
          <h2>Oppss... </h2>
          <h3>Seems the link has expired</h3>
        </Box>
      ) : (
        // Show this box if token is not expired
        <Box>
          <h1 className="title">Shared Page</h1>
          <h3>Shared password is : {decryptedSharedPW}</h3>

          <p>This link expires after 1 minute and cannot be viewed again</p>
        </Box>
      )}
    </Container>
  );
};

export default SharedVault;
