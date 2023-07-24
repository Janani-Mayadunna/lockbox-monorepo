import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICreateVault } from './interfaces';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../../helpers/request-interceptor';
import { encryptVault } from '../../../../helpers/crypto';
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
import ResponsiveAppBar from '../../../../../src/components/global/AppBar';

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
      <ResponsiveAppBar />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          marginBottom: '30px',
        }}
      >
        <Typography variant='h5'>Add Passwords</Typography>
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
              label='Username'
              variant='outlined'
              value={vaultData.username}
              name='username'
              sx={{ marginBottom: '10px', padding: '5px' }}
              onChange={(e) =>
                setVaultData({ ...vaultData, username: e.target.value })
              }
            />

            <Grid container spacing={1} alignItems='center'>
              <Grid item>
                <TextField
                  label='Password'
                  variant='outlined'
                  type='password'
                  value={vaultData.password}
                  name='password'
                  sx={{ marginBottom: '10px', padding: '5px' }}
                  onChange={(e) =>
                    setVaultData({ ...vaultData, password: e.target.value })
                  }
                />
              </Grid>
              <Grid item>
                <Tooltip title='Generate safe password' arrow>
                  <Button type='button' variant='text' sx={{ color: 'green' }}>
                    <AutoAwesomeTwoToneIcon sx={{ fontSize: '2rem' }} />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

            <TextField
              label='URI'
              variant='outlined'
              type='text'
              value={vaultData.link}
              name='link'
              sx={{ marginBottom: '10px', padding: '5px' }}
              onChange={(e) =>
                setVaultData({ ...vaultData, link: e.target.value })
              }
            />

            <Button
              type='submit'
              onClick={handleSubmit}
              variant='contained'
              sx={{
                marginBottom: '10px',
                backgroundColor: '#007bff',
                color: 'black',
              }}
            >
              Submit
            </Button>

            <Button
              type='reset'
              onClick={() =>
                setVaultData({ username: '', password: '', link: '' })
              }
              variant='contained'
              sx={{
                marginBottom: '10px',
                backgroundColor: '#6c757d',
                color: 'black',
              }}
            >
              Reset
            </Button>

            <Button
              type='button'
              variant='contained'
              sx={{
                marginBottom: '10px',
                backgroundColor: '#dc3545',
                color: 'black',
              }}
              component={Link}
              to='/dashboard'
            >
              View All
            </Button>
          </form>
        </Card>
      </Box>

      <br />
      <br />
      <br />
    </div>
  );
};

export default PasswordAdd;
