import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl, getFolders } from '../../../utils/api';
import {
  authorizedFetch,
  getVaultKey,
} from '../../../utils/request-interceptor';
import { ICreateVault, IFolder } from '../../../interfaces/vault.interfaces';
import CustomCrypto from '../../../utils/custom-crypto';

const VaultsAdd = () => {
  const [vaultData, setVaultData] = React.useState({
    category: '',
    name: '',
    folder: '',
    username: '',
    password: '',
    link: '',
    note: '',
  });
  const [characterCount, setCharacterCount] = React.useState(0);
  const [folders, setFolders] = React.useState([]);
  const [showPassword, setShowPassword] = React.useState(false);

  const maxCharacters = 300;
  const navigate = useNavigate();

  const getAllFolders = async () => {
    const userFolder = await getFolders();
    setFolders(userFolder);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVaultData({ ...vaultData, [name]: value });
    setCharacterCount(value.length);
  };

  const handleReset = () => {
    setVaultData({
      category: '',
      name: '',
      folder: '',
      username: '',
      password: '',
      link: '',
      note: '',
    });

    setCharacterCount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleReset();

    const vaultKey = await getVaultKey();

    const vaultPW = vaultData.password;

    const encryptedVaultPW = await CustomCrypto.encrypt(vaultKey, vaultPW);

    console.log('encrypted vault pw', encryptedVaultPW);

    const newVault: ICreateVault = {
      category: vaultData.category,
      name: vaultData.name,
      folder: vaultData.folder,
      link: vaultData.link,
      username: vaultData.username,
      password: encryptedVaultPW,
      note: vaultData.note,
    };

    console.log('new vault', newVault);

    await authorizedFetch(`${backendUrl}/vault`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newVault),
    })
      .then((res) => {
        if (res.status === 201) {
          console.log('vault added');
          navigate('/dashboard');
        } else {
          console.log('vault not added');
        }
      })
      .catch((err) => console.log(err));
  };

  React.useEffect(() => {
    getAllFolders();
  }, []);

  return (
    <Container>
      <h1>Vaults Update</h1>
      <button style={{ margin: '16px' }} onClick={() => navigate('/dashboard')}>
        Back
      </button>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            mt: 0.7,
            mb: 0.7,
            width: '40ch',
            display: 'flex',
            justifyContent: 'center',
          },
        }}
        autoComplete='off'
      >
        <Stack spacing={1.5}>
          <FormControl size='small' sx={{ mt: 1.5 }}>
            <InputLabel id='category_select'>Category</InputLabel>
            <Select
              sx={{ backgroundColor: '#f0f4f8cc' }}
              labelId='category_select'
              id='category'
              value={vaultData.category}
              label='Category'
              onChange={(e) =>
                setVaultData({ ...vaultData, category: e.target.value })
              }
            >
              <MenuItem value='Login'>Login</MenuItem>
              <MenuItem value='Secret Note' disabled>
                Secret Note
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size='small' sx={{ mt: 3 }}>
            <InputLabel id='folder_select'>Folder</InputLabel>
            <Select
              sx={{ backgroundColor: '#f0f4f8cc' }}
              labelId='folder_select'
              id='folder'
              value={vaultData.folder}
              label='Folder'
              onChange={(e) =>
                setVaultData({
                  ...vaultData,
                  folder: e.target.value,
                })
              }
            >
              <MenuItem value='' selected>
                <em>None</em>
              </MenuItem>
              {folders &&
                folders.map((folder: IFolder) => (
                  <MenuItem key={folder.folderName} value={folder._id}>
                    {folder.folderName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Alias'
              id='name'
              name='name'
              size='small'
              defaultValue={vaultData.name}
              onChange={(e) =>
                setVaultData({
                  ...vaultData,
                  name: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Username'
              id='username'
              name='username'
              size='small'
              defaultValue={vaultData.username}
              onChange={(e) =>
                setVaultData({
                  ...vaultData,
                  username: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl
            sx={{
              m: 1,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            variant='outlined'
          >
            <InputLabel htmlFor='password'>
              Password
            </InputLabel>
            <OutlinedInput
              sx={{ backgroundColor: '#f0f4f8cc' }}
              id='password'
              type={showPassword ? 'text' : 'password'}
              size='small'
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label='Password'
              defaultValue={vaultData.password}
              onChange={(e) =>
                setVaultData({
                  ...vaultData,
                  password: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='URI'
              id='link'
              name='link'
              defaultValue=''
              size='small'
              onChange={(e) =>
                setVaultData({ ...vaultData, link: e.target.value })
              }
            />
          </FormControl>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <FormControl>
            <TextField
              sx={{ backgroundColor: '#f0f4f8cc' }}
              label='Notes'
              id='note'
              name='note'
              defaultValue={vaultData.note}
              size='small'
              onChange={handleNoteChange}
              multiline
              rows={4}
              inputProps={{ maxLength: maxCharacters }}
            />
            {characterCount <= 300 ? (
              <Typography
                variant='body2'
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginRight: '5px',
                  color: 'green',
                  marginBottom: '15px',
                }}
              >
                Remaining Characters: {maxCharacters - vaultData.note.length} /
                300
              </Typography>
            ) : (
              <Typography
                variant='body2'
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: 'red',
                  marginRight: '5px',
                  marginBottom: '15px',
                }}
              >
                Passed maximum character count
              </Typography>
            )}
          </FormControl>

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
        </Stack>
      </Box>
    </Container>
  );
};

export default VaultsAdd;
