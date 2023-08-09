import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { ICreateVault } from '../../../interfaces/common-interfaces';
import CustomCrypto from '../../../utils/custom-crypto';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../utils/request-interceptor';

const AddVault: React.FC<{}> = () => {
  const [vaultData, setVaultData] = useState({
    username: '',
    password: '',
    link: '',
    note: '',
  });
  const [characterCount, setCharacterCount] = useState(0);

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

    console.log('add vaultData', vaultData);

    e.preventDefault();
    handleReset();

    const vaultKey = await getVaultKey();
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

    chrome.runtime.sendMessage(
        { action: 'addVault', newVault: newVault },
        (response) => {
          console.log('Background script response:', response);
        }
      );
  };

  return (
    <div>
      <Box>
        <Card
          sx={{
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
              required
              onChange={(e) =>
                setVaultData({ ...vaultData, username: e.target.value })
              }
            />

            <Grid container spacing={1} alignItems='center'>
              <Grid item>
                <TextField
                  id='password'
                  label='Password'
                  variant='outlined'
                  type='password'
                  value={vaultData.password}
                  name='password'
                  required

                  onChange={(e) =>
                    setVaultData({ ...vaultData, password: e.target.value })
                  }
                />
              </Grid>
              <Grid item></Grid>
            </Grid>

            <TextField
              label='Website link'
              variant='outlined'
              type='text'
              value={vaultData.link}
              name='link'
              onChange={(e) =>
                setVaultData({ ...vaultData, link: e.target.value })
              }
            />

            <>
              <TextField
                label='Note'
                variant='outlined'
                type='text'
                value={vaultData.note}
                name='note'
                multiline
                rows={4}
                inputProps={{ maxLength: 200 }}
                sx={{ padding: '5px' }}
                onChange={handleNoteChange}
              />

              <Typography
                variant='body2'
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: 'gray',
                }}
              >
                {characterCount} /200
              </Typography>
            </>

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
              onClick={() => handleReset()}
              variant='contained'
              sx={{
                marginBottom: '10px',
                backgroundColor: '#6c757d',
                color: 'black',
              }}
            >
              Reset
            </Button>
          </form>
        </Card>
      </Box>
    </div>
  );
};

export default AddVault;
