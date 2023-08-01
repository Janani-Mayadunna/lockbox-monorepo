import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICreateVault } from './interfaces';
import {
  authorizedFetch,
  getVaultKey,
} from '../../helpers/request-interceptor';
import { encryptVault } from '../../helpers/crypto';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import ResponsiveAppBar from '../../components/global/AppBar';
import GenPassModal from '../dashboard/components/modals/GenPassModal';

const PasswordAdd = () => {
  const [vaultData, setVaultData] = useState({
    username: '',
    password: '',
    link: '',
  });
  const [openModal, setOpenModal] = useState(false);

  // handler of modal
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleReset();

    const vaultKey = getVaultKey();
    const vaultPW = vaultData.password;

    const encryptedVaultPW = encryptVault({
      vaultPassword: vaultPW,
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

  const handleReset = () => {
    setVaultData({
      username: '',
      password: '',
      link: '',
    });
  };

  return (
    <div>
      <ResponsiveAppBar />
      <GenPassModal open={openModal} setOpenModal={setOpenModal} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          marginBottom: '30px',
        }}
      >
        <Typography variant="h5">Add Passwords</Typography>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
      >
        <Card
          sx={{
            padding: '50px',
            maxWidth: '700px',
            backgroundColor: 'rgb(234 234 234 / 50%)',
          }}
        >
          <form
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              value={vaultData.username}
              name="username"
              sx={{ marginBottom: '10px', padding: '5px' }}
              onChange={(e) =>
                setVaultData({ ...vaultData, username: e.target.value })
              }
            />

            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={vaultData.password}
                  name="password"
                  sx={{ marginBottom: '10px', padding: '5px' }}
                  onChange={(e) =>
                    setVaultData({ ...vaultData, password: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <Tooltip title="Generate safe password" arrow>
                  <Button
                    onClick={handleModalOpen}
                    type="button"
                    variant="text"
                    sx={{ color: 'green' }}
                  >
                    <AutoAwesomeTwoToneIcon sx={{ fontSize: '2rem' }} />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

            <TextField
              label="URI"
              variant="outlined"
              type="text"
              value={vaultData.link}
              name="link"
              sx={{ marginBottom: '10px', padding: '5px' }}
              onChange={(e) =>
                setVaultData({ ...vaultData, link: e.target.value })
              }
            />

            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              sx={{
                marginBottom: '10px',
                backgroundColor: '#007bff',
                color: 'black',
              }}
            >
              Submit
            </Button>

            <Button
              type="reset"
              onClick={() => handleReset()}
              variant="contained"
              sx={{
                marginBottom: '10px',
                backgroundColor: '#6c757d',
                color: 'black',
              }}
            >
              Reset
            </Button>

            <Button
              type="button"
              variant="contained"
              sx={{
                marginBottom: '10px',
                backgroundColor: '#dc3545',
                color: 'black',
              }}
              component={Link}
              to="/dashboard"
            >
              View All
            </Button>
          </form>
        </Card>
      </Box>
    </div>
  );
};

export default PasswordAdd;
