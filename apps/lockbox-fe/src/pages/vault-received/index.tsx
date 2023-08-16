import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  authorizedFetch,
  getVaultKey,
} from '../../helpers/request-interceptor';
import React, { useEffect, useState } from 'react';
import CustomCrypto from '../../helpers/custom-crypto';
import ResponsiveAppBar from '../../../src/components/global/AppBar';
import { ICreateVault } from '../dashboard/interfaces';

interface VaultData {
  vaultId: any;
  vaultUsername: string;
  vaultPassword: string;
  vaultLink: string;
  sharedUserName: string;
  sharedUserEmail: string;
  sharedSecret: string;
  isAllowedToSave: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ReceivedPasswordsVault = () => {
  const [decryptedVaults, setDecryptedVaults] = useState([
    {
      vaultId: '',
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // handler of snackbar
  const handleSnackbarClose = (
    e?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAddToVault = async (
    vaultPassword: string,
    vaultUsername: string,
    vaultLink: string,
    vaultId: any,
    vaultAlias: string,
  ) => {
    const vaultKey = getVaultKey();

    const encryptedVaultPW = await CustomCrypto.encrypt(
      vaultKey,
      vaultPassword,
    );

    const encryptedUsername = await CustomCrypto.encrypt(vaultKey, vaultUsername);

    const newVault: ICreateVault = {
      link: vaultLink,
      username: encryptedUsername,
      password: encryptedVaultPW,
      note: '',
      folder: '',
      name: vaultAlias,
    };

    await createVault(newVault);
    await handleVaultDelete(vaultId);
    await getAllReceivedVaults();
  };

  const handleVaultDelete = async (id: string) => {
    await authorizedFetch('http://localhost:4000/api/vault/delete-received', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to delete vault');
        } else {
          setSnackbarOpen(true);
          return res.json();
        }
      })
      .catch((err) => {
        throw new Error('Failed to delete vault' + err.message);
      });

    await getAllReceivedVaults();
  };

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

  useEffect(() => {
    getAllReceivedVaults();
  }, []);

  useEffect(() => {
    const getDecryptedVaults = async () => {
      const decryptedVault = receivedVaults.map(async (vault: VaultData) => {
        return await CustomCrypto.decrypt(
          vault.sharedSecret,
          vault.vaultPassword,
        );

      });

      const decx = await Promise.all(decryptedVault);

      const sanitizedDecryptedVaults = decx.map(
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

  return (
    <>
      <ResponsiveAppBar />
      <Container sx={{ width: 1000 }}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            Successfully Done!
          </Alert>
        </Snackbar>
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
                              data.vaultId,
                              data.vaultAlias,
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
                        onClick={() => {
                          handleVaultDelete(data.vaultId);
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
