/* eslint-disable react-hooks/exhaustive-deps */
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
import { authorizedFetch } from '../../../src/helpers/request-interceptor';
import { useEffect, useState } from 'react';
import { decryptVault } from '../../../src/helpers/crypto';

interface VaultData {
  vaultUsername: string;
  vaultPassword: string;
  sharedUserName: string;
  sharedUserEmail: string;
  sharedSecret: string;
}

const ReceivedPasswordsVault = () => {
  const [decryptedVaults, setDecryptedVaults] = useState([
    {
      vaultUsername: '',
      vaultPassword: '',
      sharedUserName: '',
      sharedUserEmail: '',
      sharedSecret: '',
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

        getDecryptedVaults();
      })
      .catch((err: any) => {
        throw new Error(err);
      });
  };

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

  useEffect(() => {
    getAllReceivedVaults();
  }, []);

  useEffect(() => {
    getDecryptedVaults();
  }, [receivedVaults]);

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
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 4, mb: 4 }}
                      >
                        Add to My Vault
                      </Button>
                      <Button variant="contained" color="secondary">
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
