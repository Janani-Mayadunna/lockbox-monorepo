import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICreateVault } from './interfaces';
import {
  authorizedFetch,
  getVaultKey,
} from '../../helpers/request-interceptor';
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
import CustomCrypto from '../../../src/helpers/custom-crypto';

const PasswordAdd = () => {
  const [vaultData, setVaultData] = useState({
    username: '',
    password: '',
    link: '',
    note: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  // handler of modal
  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleReset = () => {
    setVaultData({
      username: '',
      password: '',
      link: '',
      note: '',
    });

    setCharacterCount(0);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVaultData({ ...vaultData, [name]: value });
    setCharacterCount(value.length);
  };

  const handleSubmit = async (e: any) => {
    if (!vaultData.username || !vaultData.password) {
      return;
    }

    e.preventDefault();
    handleReset();

    const vaultKey = getVaultKey();
    const vaultPW = vaultData.password;

    const encryptedVaultPW = await CustomCrypto.encrypt(vaultKey, vaultPW);

    const newVault: ICreateVault = {
      link: vaultData.link,
      username: vaultData.username,
      password: encryptedVaultPW,
      note: vaultData.note,
    };

    // console.log('newVault', newVault)

    // const decryptedDataj = await CustomCrypto.decrypt(vaultKey, encryptedVaultPW);
    //   console.log('decrypted data', decryptedDataj);

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
    <div>
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
              required
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
                  required
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
              label="Website link"
              variant="outlined"
              type="text"
              value={vaultData.link}
              name="link"
              sx={{ marginBottom: '10px', padding: '5px' }}
              onChange={(e) =>
                setVaultData({ ...vaultData, link: e.target.value })
              }
            />

            <>
              <TextField
                label="Note"
                variant="outlined"
                type="text"
                value={vaultData.note}
                name="note"
                multiline
                rows={4}
                inputProps={{ maxLength: 200 }}
                sx={{ padding: '5px' }}
                onChange={handleNoteChange}
              />

              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: 'gray',
                  marginRight: '5px',
                  marginBottom: '25px',
                }}
              >
                {characterCount} /200
              </Typography>
            </>

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
