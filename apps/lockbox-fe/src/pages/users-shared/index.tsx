/* eslint-disable no-console */
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../src/helpers/request-interceptor';
import { useEffect, useState } from 'react';
import { decryptVault } from '../../../src/helpers/crypto';
import CustomCrypto from '../../../src/helpers/custom-crypto';
import { ICreateVault } from '../add-password/interfaces';

interface VaultData {
  vaultUsername: string;
  vaultPassword: string;
  vaultLink: string;
  sharedUserName: string;
  sharedUserEmail: string;
  sharedSecret: string;
  isAllowedToSave: boolean;
}

const ReceivedPasswordsVault = () => {
  const [decryptedVaults, setDecryptedVaults] = useState([
    {
      vaultUsername: '',
      vaultPassword: '',
      vaultLink: '',
      sharedUserName: '',
      sharedUserEmail: '',
      sharedSecret: '',
      isAllowedToSave: false,
    },
  ]);
  const [receivedVaults, setReceivedVaults] = useState([]);

  const getAllReceivedVaults = async () => {
    await authorizedFetch('http://localhost:4000/api/vault/received-vaults', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setReceivedVaults(data);
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  };

  useEffect(() => {
    getAllReceivedVaults();
  }, []);

  useEffect(() => {
    const getDecryptedVaults = () => {
      const decryptedVault = receivedVaults.map((vault: VaultData) => {
        return decryptVault({
          vaultPassword: vault.vaultPassword,
          vaultKey: vault.sharedSecret,
        });
      });

      const sanitizedDecryptedVaults = decryptedVault.map(
        (value: string | undefined) => (value === undefined ? '' : value),
      );

      setDecryptedVaults(
        receivedVaults.map((vault: VaultData, index: number) => {
          return {
            ...vault,
            vaultPassword: sanitizedDecryptedVaults[index],
          };
        }),
      );
    };

    getDecryptedVaults();
  }, [receivedVaults]);

  const handleAddToVault = async (
    vaultPassword: string,
    vaultUsername: string,
    vaultLink: string,
  ) => {
    const vaultKey = getVaultKey();

    const encryptedVaultPW = await CustomCrypto.encrypt(
      vaultKey,
      vaultPassword,
    );

    const newVault: ICreateVault = {
      link: vaultLink,
      username: vaultUsername,
      password: encryptedVaultPW,
      note: '',
    };

    await createVault(newVault);
  };

  const createVault = async (newVault: ICreateVault) => {
    authorizedFetch('http://localhost:4000/api/vault', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVault),
    })
      .then((res) => {
        if (res.status !== 201) {
          throw new Error('Failed to create vault');
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        throw new Error('Failed to create vault' + err.message);
      });
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ width: 1000 }}>
        <div>
          <Typography
            sx={{ mt: 4, mb: 4 }}
            variant="h4"
            component="h2"
            gutterBottom
          >
            Shared Passwords
          </Typography>

          <Box>
            {/* map over vaultData array and display */}
            {decryptedVaults.map((data: any, index: any) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ backgroundColor: '#ebeef4' }}
                >
                  <Typography variant="subtitle1" component="h5">
                    Shared by : {data.sharedUserName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box display="flex" justifyContent="space-around">
                    <Box>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Username: </strong> {data.vaultUsername}
                      </Typography>
                      {data.vaultLink !== '' ? (
                        <Typography
                          gutterBottom
                          sx={{ mt: 1, mb: 1 }}
                          variant="h6"
                        >
                          <strong>Website: </strong> {data.vaultLink}
                        </Typography>
                      ) : (
                        ''
                      )}
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Password:</strong> {data.vaultPassword}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Sender Name:</strong> {data.sharedUserName}
                      </Typography>
                      <Typography
                        gutterBottom
                        sx={{ mt: 1, mb: 1 }}
                        variant="h6"
                      >
                        <strong>Sender Email:</strong> {data.sharedUserEmail}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {data.isAllowedToSave ? (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 4, mb: 4 }}
                          onClick={() =>
                            handleAddToVault(
                              data.vaultPassword,
                              data.vaultUsername,
                              data.vaultLink,
                            )
                          }
                        >
                          Add to My Vault
                        </Button>
                      ) : (
                        ''
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                          width: 150,
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </div>
      </Container>
    </>
  );
};

export default ReceivedPasswordsVault;
